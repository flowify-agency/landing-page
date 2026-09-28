import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPaymentToken } from "../token.js";
import clientPromise from "../../../../lib/db/mongodb.js";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "VALIDATION", message: "Token is required." }, { status: 400 });
    }

    // Verify token to retrieve verified amount
    const payload = verifyPaymentToken(token);
    if (!payload) {
      return NextResponse.json({ error: "INVALID_TOKEN", message: "Token is invalid or has expired." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "CONFIG_ERROR", message: "Razorpay credentials are not configured on Flowify." },
        { status: 500 }
      );
    }

    // Create Razorpay Order (amount in paise: INR * 100)
    const amountInPaise = Math.round(Number(payload.amount) * 100);
    const receiptId = String(payload.depositSessionId || "").slice(0, 40);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64"),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: payload.currency || "INR",
        receipt: receiptId,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay API Error:", errorText);
      return NextResponse.json(
        { error: "GATEWAY_ERROR", message: `Razorpay order creation failed: ${errorText}` },
        { status: 502 }
      );
    }

    const order = await response.json();

    // Link Razorpay Order ID with PaymentRequest in MongoDB
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection("PaymentRequest").updateOne(
        { depositSessionId: payload.depositSessionId },
        { $set: { razorpayOrderId: order.id, updatedAt: new Date() } }
      );
    } catch (dbErr) {
      console.warn("Failed to link razorpayOrderId to PaymentRequest:", dbErr);
    }

    return NextResponse.json({
      success: true,
      id: order.id,
      keyId,
    });
  } catch (err) {
    console.error("Razorpay order route error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: err.message }, { status: 500 });
  }
}
