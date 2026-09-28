import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPaymentToken } from "../token.js";
import clientPromise from "../../../../lib/db/mongodb.js";
import { logger } from "../../../../lib/logger.js";
import { sendAlert } from "../../../../lib/alerts.js";

const FLOWIFY_SHARED_SECRET = process.env.FLOWIFY_SHARED_SECRET || "flowify-shared-secret-key-change-this-in-prod";
if (process.env.NODE_ENV === "production" && FLOWIFY_SHARED_SECRET === "flowify-shared-secret-key-change-this-in-prod") {
  console.warn("CRITICAL SECURITY WARNING: FLOWIFY_SHARED_SECRET is using default placeholder in production!");
}

export async function POST(req) {
  let requestBody = {};
  try {
    requestBody = await req.json();
    const { token, status, razorpayPaymentId } = requestBody;

    if (!token || !status) {
      logger.warn("Complete payment route validation failed — missing token or status");
      return NextResponse.json(
        { error: "VALIDATION", message: "Token and status are required." },
        { status: 400 }
      );
    }

    // Verify token
    const payload = verifyPaymentToken(token);
    if (!payload) {
      logger.warn("Invalid payment token supplied during complete checkout phase");
      return NextResponse.json(
        { error: "INVALID_TOKEN", message: "Token is invalid or has expired." },
        { status: 400 }
      );
    }

    logger.info("Processing complete checkout payment notification", { 
      depositSessionId: payload.depositSessionId, 
      clientId: payload.clientId, 
      status 
    });

    // 1. Authoritative server-side verification with Razorpay API
    if (status === "success") {
      if (!razorpayPaymentId) {
        logger.warn("Success payment reported without razorpayPaymentId", { depositSessionId: payload.depositSessionId });
        return NextResponse.json(
          { error: "VALIDATION", message: "razorpayPaymentId is required for successful payments." },
          { status: 400 }
        );
      }

      const isSimulated = razorpayPaymentId.startsWith("pay_simulated_test_");
      const isDevOrTest = process.env.NODE_ENV !== "production" || process.env.ALLOW_PAYMENT_SIMULATOR === "true";

      if (isSimulated && isDevOrTest) {
        logger.info("Allowing simulated test payment in development environment", { 
          depositSessionId: payload.depositSessionId, 
          razorpayPaymentId 
        });
      } else {
        const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (keyId && keySecret) {
          try {
            const rzpResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
              headers: {
                Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
              },
              signal: AbortSignal.timeout(5000),
            });

          if (!rzpResponse.ok) {
            const errText = await rzpResponse.text();
            logger.error("Razorpay payment verification request failed", { razorpayPaymentId, errText });
            return NextResponse.json(
              { error: "VERIFICATION_FAILED", message: "Could not verify payment with gateway." },
              { status: 400 }
            );
          }

          const rzpPayment = await rzpResponse.json();

          // Check payment status
          if (!["captured", "authorized"].includes(rzpPayment.status)) {
            logger.warn("Razorpay payment not captured/authorized", { razorpayPaymentId, rzpStatus: rzpPayment.status });
            return NextResponse.json(
              { error: "PAYMENT_NOT_CAPTURED", message: `Payment is in ${rzpPayment.status} state.` },
              { status: 400 }
            );
          }

          // Check amount matching (Razorpay amount is in paise: INR * 100)
          const expectedPaise = Math.round(Number(payload.amount) * 100);
          if (Number(rzpPayment.amount) !== expectedPaise) {
            logger.error("Payment amount mismatch detected", { 
              razorpayPaymentId, 
              expected: expectedPaise, 
              actual: rzpPayment.amount 
            });
            return NextResponse.json(
              { error: "AMOUNT_MISMATCH", message: "Payment amount does not match order." },
              { status: 400 }
            );
          }
        } catch (vErr) {
          logger.error("Exception during Razorpay payment verification", { error: vErr.message });
          return NextResponse.json(
            { error: "GATEWAY_TIMEOUT", message: "Verification with payment gateway timed out." },
            { status: 502 }
          );
        }
      }
      }
    }

    // Determine the webhook URL
    let webhookUrl = process.env.WINSPIN_WEBHOOK_URL;
    if (!webhookUrl && payload.callbackUrl) {
      try {
        const url = new URL(payload.callbackUrl);
        webhookUrl = `${url.protocol}//${url.host}/api/deposit/webhook`;
      } catch (e) {
        logger.error("Failed to parse callbackUrl", { error: e, callbackUrl: payload.callbackUrl });
      }
    }
    if (!webhookUrl) {
      logger.error("WINSPIN_WEBHOOK_URL is not set and no callbackUrl could be parsed");
      return NextResponse.json(
        { error: "CONFIG_ERROR", message: "Payment webhook URL is not configured." },
        { status: 500 }
      );
    }

    // Generate HMAC signature for webhook callback
    const sigPayload = `${payload.depositSessionId}|${payload.amount}|${status}`;
    const signature = crypto
      .createHmac("sha256", FLOWIFY_SHARED_SECRET)
      .update(sigPayload)
      .digest("hex");

    logger.info("Delivering payment callback webhook to client site", { 
      depositSessionId: payload.depositSessionId, 
      webhookUrl 
    });

    // Call child site webhook with resilience
    let response = null;
    let webhookResult = null;
    let webhookError = null;

    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-flowify-signature": signature,
        },
        body: JSON.stringify({
          depositSessionId: payload.depositSessionId,
          amount: Number(payload.amount),
          status,
          signature,
          razorpayPaymentId: razorpayPaymentId || null
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        webhookError = await response.text();
        await sendAlert("ERROR", "Payment webhook delivery returned non-200 from merchant", {
          depositSessionId: payload.depositSessionId,
          clientId: payload.clientId,
          webhookUrl,
          responseStatus: response.status,
          responseBody: webhookError
        });
      } else {
        webhookResult = await response.json();
        logger.info("Webhook delivered successfully", { depositSessionId: payload.depositSessionId });
      }
    } catch (netErr) {
      webhookError = netErr.message || "Network error contacting merchant webhook";
      logger.error("Merchant webhook connection exception", { error: webhookError });
    }

    // Log payment completion to MongoDB reliably regardless of webhook delivery result
    try {
      const client = await clientPromise;
      const db = client.db();

      // Insert completion record
      await db.collection("PaymentCompletion").insertOne({
        clientId: payload.clientId,
        depositSessionId: payload.depositSessionId,
        amount: Number(payload.amount),
        email: payload.email,
        callbackUrl: payload.callbackUrl,
        paymentStatus: status,
        razorpayPaymentId: razorpayPaymentId || null,
        webhookUrl,
        webhookSuccess: response ? response.ok : false,
        webhookStatusCode: response ? response.status : 0,
        webhookResult: webhookResult || webhookError,
        isMandate: !!payload.isMandate,
        subscriptionPlan: payload.subscriptionPlan || null,
        completedAt: new Date(),
      });

      // Update the original PaymentRequest status atomically if it's still registered
      const targetStatus = status === "success" ? "success" : "failed";
      await db.collection("PaymentRequest").updateOne(
        { depositSessionId: payload.depositSessionId },
        { 
          $set: { 
            status: targetStatus, 
            razorpayPaymentId: razorpayPaymentId || null,
            updatedAt: new Date() 
          } 
        }
      );
    } catch (dbErr) {
      logger.error("Failed to log payment completion database updates", { 
        depositSessionId: payload.depositSessionId, 
        error: dbErr 
      });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "WEBHOOK_FAILED", message: `Webhook callback failed: ${webhookError}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      webhookResult,
    });
  } catch (err) {
    await sendAlert("ERROR", "Flowify payment completion endpoint threw exception", {
      error: err.message,
      stack: err.stack,
      requestBody
    });
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message || "Failed to complete payment." },
      { status: 500 }
    );
  }
}
