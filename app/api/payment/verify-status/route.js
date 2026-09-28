import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "../../../../lib/db/mongodb.js";

const FLOWIFY_SHARED_SECRET = process.env.FLOWIFY_SHARED_SECRET || "flowify-shared-secret-key-change-this-in-prod";

export async function POST(req) {
  try {
    const { clientId, depositSessionId, signature } = await req.json();

    if (!clientId || !depositSessionId || !signature) {
      return NextResponse.json(
        { error: "VALIDATION", message: "Missing required fields: clientId, depositSessionId, signature." },
        { status: 400 }
      );
    }

    // 1. Verify incoming signature
    const signaturePayload = `${clientId}|${depositSessionId}`;
    const expectedSignature = crypto
      .createHmac("sha256", FLOWIFY_SHARED_SECRET)
      .update(signaturePayload)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid signature on verification status request:", { signature, expectedSignature });
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Invalid signature verification." },
        { status: 401 }
      );
    }

    // 2. Query database for completed payment details
    const client = await clientPromise;
    const db = client.db();

    const completion = await db.collection("PaymentCompletion").findOne({ depositSessionId });
    const request = await db.collection("PaymentRequest").findOne({ depositSessionId });

    const isReqSuccess = request && ["success", "completed"].includes(request.status);

    if (!completion) {
      return NextResponse.json({
        success: true,
        verified: isReqSuccess,
        amount: request?.amount || 0,
        paymentStatus: request?.status || "registered",
        reason: isReqSuccess ? "Verified via PaymentRequest." : "No payment completion record found in gateway.",
        isMandate: request ? !!request.isMandate : false,
        subscriptionPlan: request ? request.subscriptionPlan : null,
        requestRecord: request ? {
          status: request.status,
          createdAt: request.createdAt,
        } : null
      });
    }

    const isSuccess = ["success", "completed"].includes(completion.paymentStatus) || isReqSuccess;

    return NextResponse.json({
      success: true,
      verified: isSuccess,
      amount: completion.amount,
      paymentStatus: completion.paymentStatus,
      completedAt: completion.completedAt,
      webhookSuccess: completion.webhookSuccess,
      isMandate: !!completion.isMandate,
      subscriptionPlan: completion.subscriptionPlan || null,
      requestRecord: request ? {
        status: request.status,
        createdAt: request.createdAt,
      } : null
    });

  } catch (err) {
    console.error("Error in Flowify verify-status API:", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to verify payment status." },
      { status: 500 }
    );
  }
}
