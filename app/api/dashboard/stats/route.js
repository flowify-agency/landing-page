import { NextResponse } from "next/server";
import { verifyDashboardToken } from "../../../../lib/dashboard-auth.js";
import clientPromise from "../../../../lib/db/mongodb.js";

const COOKIE_NAME = "flowify_merchant_token";

export async function GET(req) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const user = verifyDashboardToken(token);

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Please log in to access dashboard data." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "7d"; // 'today' | '7d' | '30d' | 'lifetime'
    let requestedAccount = searchParams.get("account") || "all";
    const mode = (searchParams.get("mode") || "live").toLowerCase(); // 'live' | 'test'

    // Enforce role-based access control: only Randhir (admin) can view 'all' or others
    if (user.role !== "admin") {
      requestedAccount = user.accountKey;
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. Calculate Date Range (IST UTC+5:30 aligned)
    const now = new Date();
    let startDate = null;

    if (period === "today") {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } // 'lifetime' leaves startDate as null

    // 2. Build Filter Clauses
    const andClauses = [];

    // Date clause: match completedAt or createdAt
    if (startDate) {
      andClauses.push({
        $or: [
          { completedAt: { $gte: startDate } },
          { createdAt: { $gte: startDate } },
        ],
      });
    }

    // Account clause
    if (requestedAccount && requestedAccount !== "all") {
      const reg = new RegExp(requestedAccount, "i");
      andClauses.push({
        $or: [
          { gatewayAccountId: reg },
          { "gatewayAccount.name": reg },
          { "gatewayAccount.id": reg },
          { "gatewayAccount.key": reg }
        ]
      });
    }

    // Mode clause (Live vs Test)
    if (mode === "live") {
      andClauses.push({
        $and: [
          { mode: { $ne: "test" } },
          { isLive: { $ne: false } },
          {
            $or: [
              { mode: "live" },
              { isLive: true },
              { gatewayAccountId: /live/i },
              { "gatewayAccount.id": /live/i },
              { "gatewayAccount.name": /live/i },
              { "gatewayAccount.keyId": /^rzp_live_/i },
            ],
          },
        ],
      });
    } else if (mode === "test") {
      andClauses.push({
        $or: [
          { mode: "test" },
          { isLive: false },
          { gatewayAccountId: /test/i },
          { "gatewayAccount.id": /test/i },
          { "gatewayAccount.name": /test/i },
          { "gatewayAccount.keyId": /^rzp_test_/i },
          { razorpayPaymentId: /test/i }
        ]
      });
    }

    const query = andClauses.length > 0 ? { $and: andClauses } : {};

    // 3. Query Payment Completions
    const completions = await db.collection("PaymentCompletion")
      .find(query)
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(200)
      .toArray();

    // Also fetch requests count if needed
    const totalRequestsCount = await db.collection("PaymentRequest").countDocuments(query);

    // 4. Calculate Aggregate Metrics
    let collectedAmount = 0;
    let capturedCount = 0;
    let failedCount = 0;
    let refundCount = 0;
    let disputeCount = 0;

    const methodSplit = {
      upi: { count: 0, amount: 0 },
      card: { count: 0, amount: 0 },
      netbanking: { count: 0, amount: 0 },
      other: { count: 0, amount: 0 }
    };

    completions.forEach((c) => {
      const amt = Number(c.amount) || 0;
      const isSuccess = c.paymentStatus === "success" || c.paymentStatus === "captured" || c.status === "success";

      if (isSuccess) {
        collectedAmount += amt;
        capturedCount += 1;

        // Categorize payment method
        const m = String(c.method || c.paymentMethod || "upi").toLowerCase();
        if (m.includes("upi") || m.includes("gpay") || m.includes("phonepe") || m.includes("paytm")) {
          methodSplit.upi.count += 1;
          methodSplit.upi.amount += amt;
        } else if (m.includes("card") || m.includes("credit") || m.includes("debit")) {
          methodSplit.card.count += 1;
          methodSplit.card.amount += amt;
        } else if (m.includes("net") || m.includes("bank")) {
          methodSplit.netbanking.count += 1;
          methodSplit.netbanking.amount += amt;
        } else {
          methodSplit.other.count += 1;
          methodSplit.other.amount += amt;
        }
      } else if (c.paymentStatus === "failed" || c.status === "failed") {
        failedCount += 1;
      }
    });

    // 5. Generate Smooth Graph Data Points
    const chartPoints = [];
    if (period === "today") {
      // 8 time slots across 24h
      for (let h = 0; h <= 24; h += 3) {
        const slotHour = String(h).padStart(2, "0") + ":00";
        chartPoints.push({ label: slotHour, amount: 0, count: 0, timestamp: h });
      }
      completions.forEach((c) => {
        const itemDate = c.completedAt || c.createdAt;
        if (c.paymentStatus === "success" && itemDate) {
          const hour = new Date(itemDate).getHours();
          const bucket = chartPoints.reduce((prev, curr) => Math.abs(curr.timestamp - hour) < Math.abs(prev.timestamp - hour) ? curr : prev);
          bucket.amount += Number(c.amount) || 0;
          bucket.count += 1;
        }
      });
    } else if (period === "7d") {
      // 7 daily points
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        chartPoints.push({ label: dayLabel, dateStr: d.toISOString().slice(0, 10), amount: 0, count: 0 });
      }
      completions.forEach((c) => {
        const itemDate = c.completedAt || c.createdAt;
        if (c.paymentStatus === "success" && itemDate) {
          const cDate = new Date(itemDate).toISOString().slice(0, 10);
          const match = chartPoints.find(p => p.dateStr === cDate);
          if (match) {
            match.amount += Number(c.amount) || 0;
            match.count += 1;
          }
        }
      });
    } else if (period === "30d") {
      // 10 intervals
      for (let i = 9; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000);
        const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        chartPoints.push({ label: dayLabel, startTime: d.getTime(), amount: 0, count: 0 });
      }
      completions.forEach((c) => {
        const itemDate = c.completedAt || c.createdAt;
        if (c.paymentStatus === "success" && itemDate) {
          const t = new Date(itemDate).getTime();
          const bucket = chartPoints.reduce((prev, curr) => Math.abs(curr.startTime - t) < Math.abs(prev.startTime - t) ? curr : prev);
          bucket.amount += Number(c.amount) || 0;
          bucket.count += 1;
        }
      });
    } else {
      // Lifetime: monthly intervals (last 6 months)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        chartPoints.push({ label: monthLabel, yearMonth: `${d.getFullYear()}-${d.getMonth()}`, amount: 0, count: 0 });
      }
      completions.forEach((c) => {
        const itemDate = c.completedAt || c.createdAt;
        if (c.paymentStatus === "success" && itemDate) {
          const cd = new Date(itemDate);
          const ym = `${cd.getFullYear()}-${cd.getMonth()}`;
          const match = chartPoints.find(p => p.yearMonth === ym);
          if (match) {
            match.amount += Number(c.amount) || 0;
            match.count += 1;
          }
        }
      });
    }

    // 6. Format Payments Table
    const formattedPayments = completions.map((c) => {
      let resolvedMethod = "UPI";
      const m = String(c.method || c.paymentMethod || "").toLowerCase();
      if (m.includes("card")) resolvedMethod = "Cards";
      else if (m.includes("net") || m.includes("bank")) resolvedMethod = "Netbanking";

      const isSuccess = c.paymentStatus === "success" || c.paymentStatus === "captured" || c.status === "success";

      const isRecordLive = c.mode === "live" || 
        c.isLive === true || 
        /live/i.test(c.gatewayAccountId || "") || 
        /live/i.test(c.gatewayAccount?.id || "") || 
        /live/i.test(c.gatewayAccount?.name || "");

      const recDate = c.completedAt || c.createdAt;

      return {
        id: c.razorpayPaymentId || c.depositSessionId,
        paymentId: c.razorpayPaymentId || `pay_${c.depositSessionId?.slice(0, 10)}`,
        orderId: c.depositSessionId,
        email: c.email || "Customer",
        amount: Number(c.amount) || 0,
        status: isSuccess ? "captured" : (c.paymentStatus || "failed"),
        gatewayAccountName: c.gatewayAccount?.name || c.gatewayAccountId || "Default",
        gatewayAccountId: c.gatewayAccountId || "default",
        method: resolvedMethod,
        mode: isRecordLive ? "live" : "test",
        date: recDate ? new Date(recDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "Recent"
      };
    });

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        displayName: user.displayName,
        role: user.role,
        accountKey: user.accountKey
      },
      selectedAccount: requestedAccount,
      period,
      mode,
      summary: {
        collectedAmount,
        capturedCount,
        refundsAmount: 0,
        refundsCount: 0,
        disputesCount: 0,
        failedCount,
        ordersCount: totalRequestsCount || capturedCount + failedCount
      },
      methodSplit,
      chartPoints,
      payments: formattedPayments
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: "INTERNAL", message: "Failed to load dashboard metrics." }, { status: 500 });
  }
}
