import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/db/mongodb.js";
import crypto from "node:crypto";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const count = await db.collection("PaymentCompletion").countDocuments();
    if (count > 0) {
      return NextResponse.json({ success: true, message: "Database already contains payment data.", count });
    }

    const accounts = [
      { id: "acc_live_janardhan", name: "Janardhan (Live)", key: "janardhan" },
      { id: "acc_live_randhir", name: "Randhir (Live)", key: "randhir" },
      { id: "acc_test_sanju", name: "Sanju (Test)", key: "sanju" },
      { id: "acc_live_yashodanand", name: "Yashodanand (Live)", key: "yashodanand" }
    ];

    const methods = ["upi", "upi", "upi", "card", "netbanking"];
    const now = Date.now();
    const demoItems = [];

    // Generate ~35 realistic transactions across past 14 days
    for (let i = 0; i < 35; i++) {
      const acc = accounts[i % accounts.length];
      const hoursAgo = Math.floor(Math.random() * (14 * 24));
      const txTime = new Date(now - hoursAgo * 60 * 60 * 1000);
      const isSuccess = Math.random() > 0.12;
      const amount = [300, 500, 1000, 2000, 5000, 10000, 15000][Math.floor(Math.random() * 7)];
      const randId = crypto.randomBytes(6).toString("hex");

      demoItems.push({
        clientId: "lets-go-gambling",
        depositSessionId: `sess_${randId}`,
        amount,
        email: `player_${randId.slice(0, 4)}@winandspin.local`,
        callbackUrl: "http://localhost:9000/deposit/callback",
        paymentStatus: isSuccess ? "success" : "failed",
        razorpayPaymentId: `pay_${randId.slice(0, 8)}`,
        gatewayAccountId: acc.id,
        gatewayAccount: { id: acc.id, name: acc.name, key: acc.key },
        method: methods[Math.floor(Math.random() * methods.length)],
        createdAt: txTime
      });
    }

    await db.collection("PaymentCompletion").insertMany(demoItems);

    return NextResponse.json({ success: true, message: `Inserted ${demoItems.length} demo payment records.`, count: demoItems.length });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "INTERNAL", message: err.message }, { status: 500 });
  }
}
