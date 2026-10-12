import { NextResponse } from "next/server";
import crypto from "crypto";
import { signPaymentToken } from "../token.js";
import clientPromise from "../../../../lib/db/mongodb.js";

const FLOWIFY_SHARED_SECRET = process.env.FLOWIFY_SHARED_SECRET || "flowify-shared-secret-key-change-this-in-prod";
if (process.env.NODE_ENV === "production" && FLOWIFY_SHARED_SECRET === "flowify-shared-secret-key-change-this-in-prod") {
  console.warn("CRITICAL SECURITY WARNING: FLOWIFY_SHARED_SECRET is using default placeholder in production!");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { clientId, amount, depositSessionId, email, callbackUrl, webhookUrl, merchantName, signature, userName, userId, userBalance, isMandate, subscriptionPlan, gatewayAccount } = body;

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount < 1 || !isFinite(numericAmount)) {
      return NextResponse.json(
        { error: "VALIDATION", message: "Amount must be a valid positive number." },
        { status: 400 }
      );
    }

    if (!callbackUrl || typeof callbackUrl !== "string") {
      return NextResponse.json(
        { error: "VALIDATION", message: "A valid callbackUrl is required." },
        { status: 400 }
      );
    }

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json(
        { error: "VALIDATION", message: "A valid webhookUrl is required." },
        { status: 400 }
      );
    }

    if (!gatewayAccount || !gatewayAccount.keyId || !gatewayAccount.keySecret) {
      return NextResponse.json(
        { error: "VALIDATION", message: "gatewayAccount with keyId and keySecret is required from calling application." },
        { status: 400 }
      );
    }

    // Validate signature securely with timingSafeEqual and flexible amount formatting
    const sigPayload1 = `${clientId}|${depositSessionId}|${amount}|${email}`;
    const sigPayload2 = `${clientId}|${depositSessionId}|${numericAmount.toFixed(2)}|${email}`;
    const exp1 = crypto.createHmac("sha256", FLOWIFY_SHARED_SECRET).update(sigPayload1).digest("hex");
    const exp2 = crypto.createHmac("sha256", FLOWIFY_SHARED_SECRET).update(sigPayload2).digest("hex");

    const sigBuf = Buffer.from(String(signature || ""), "hex");
    const exp1Buf = Buffer.from(exp1, "hex");
    const exp2Buf = Buffer.from(exp2, "hex");

    const isMatch1 = sigBuf.length === exp1Buf.length && crypto.timingSafeEqual(sigBuf, exp1Buf);
    const isMatch2 = sigBuf.length === exp2Buf.length && crypto.timingSafeEqual(sigBuf, exp2Buf);

    if (!isMatch1 && !isMatch2) {
      console.error("Invalid signature on register request:", { signature, expectedSignature: exp1 });
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Invalid signature verification." },
        { status: 401 }
      );
    }

    // Generate stateless token with public fields ONLY (keySecret is stored securely in DB only)
    const token = signPaymentToken({
      clientId,
      amount: numericAmount,
      depositSessionId,
      email,
      callbackUrl,
      webhookUrl,
      merchantName: merchantName || "Win & Spin",
      isMandate: !!isMandate,
      subscriptionPlan: subscriptionPlan || null,
      gatewayAccount: {
        id: gatewayAccount.id,
        name: gatewayAccount.name,
        keyId: gatewayAccount.keyId,
        // keySecret deliberately excluded to prevent browser exposure
      },
    });

    // Determine public site URL / host
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    let checkoutUrl;
    if (siteUrl && siteUrl.startsWith("http")) {
      checkoutUrl = `${siteUrl.replace(/\/$/, "")}/checkout/${token}`;
    } else {
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "flowify.agency";
      const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
      checkoutUrl = `${protocol}://${host}/checkout/${token}`;
    }

    // Log payment request to MongoDB with secure credentials
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection("PaymentRequest").updateOne(
        { depositSessionId },
        {
          $set: {
            clientId,
            amount: numericAmount,
            depositSessionId,
            email,
            callbackUrl,
            webhookUrl,
            merchantName: merchantName || "Win & Spin",
            checkoutUrl,
            status: "registered",
            isMandate: !!isMandate,
            subscriptionPlan: subscriptionPlan || null,
            mode: (gatewayAccount.keyId?.startsWith("rzp_live_") || gatewayAccount.id?.includes("live") || gatewayAccount.isLive) ? "live" : "test",
            isLive: Boolean(gatewayAccount.keyId?.startsWith("rzp_live_") || gatewayAccount.id?.includes("live") || gatewayAccount.isLive),
            gatewayAccountId: gatewayAccount.id || "default",
            gatewayAccount: {
              id: gatewayAccount.id,
              name: gatewayAccount.name,
              keyId: gatewayAccount.keyId,
              keySecret: gatewayAccount.keySecret, // Kept safe on server DB
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            ...(userName && { userName }),
            ...(userId && { userId }),
            ...(userBalance !== undefined && { userBalance: Number(userBalance) }),
          }
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error("Failed to log payment request to MongoDB:", dbErr);
    }

    return NextResponse.json({
      success: true,
      checkoutUrl,
    });
  } catch (err) {
    console.error("Error in Flowify payment register:", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to register payment request." },
      { status: 500 }
    );
  }
}
