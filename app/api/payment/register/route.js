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

    // Validate signature
    const signaturePayload = `${clientId}|${depositSessionId}|${amount}|${email}`;
    const expectedSignature = crypto
      .createHmac("sha256", FLOWIFY_SHARED_SECRET)
      .update(signaturePayload)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid signature on register request:", { signature, expectedSignature });
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Invalid signature verification." },
        { status: 401 }
      );
    }

    // Generate stateless token with dynamic gateway account credentials, callbackUrl and webhookUrl
    const token = signPaymentToken({
      clientId,
      amount,
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
        keySecret: gatewayAccount.keySecret,
      },
    });

    // Determine public site URL / host
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    let checkoutUrl;
    if (siteUrl && siteUrl.startsWith("http")) {
      checkoutUrl = `${siteUrl.replace(/\/$/, "")}/checkout/${token}`;
    } else {
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:9500";
      const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
      checkoutUrl = `${protocol}://${host}/checkout/${token}`;
    }

    // Log payment request to MongoDB
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection("PaymentRequest").insertOne({
        clientId,
        amount: Number(amount),
        depositSessionId,
        email,
        callbackUrl,
        webhookUrl,
        merchantName: merchantName || "Win & Spin",
        checkoutUrl,
        status: "registered",
        isMandate: !!isMandate,
        subscriptionPlan: subscriptionPlan || null,
        gatewayAccountId: gatewayAccount.id || "default",
        gatewayAccount: {
          id: gatewayAccount.id,
          name: gatewayAccount.name,
          keyId: gatewayAccount.keyId,
        },
        createdAt: new Date(),
        ...(userName && { userName }),
        ...(userId && { userId }),
        ...(userBalance !== undefined && { userBalance: Number(userBalance) }),
      });
    } catch (dbErr) {
      console.error("Failed to log payment request to MongoDB:", dbErr);
      // Don't fail the request if DB logging fails
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
