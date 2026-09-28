import crypto from "crypto";

const FLOWIFY_SHARED_SECRET = process.env.FLOWIFY_SHARED_SECRET || "flowify-shared-secret-key-change-this-in-prod";

export function signPaymentToken(payload) {
  const payloadString = JSON.stringify({
    ...payload,
    exp: Date.now() + 3600000 // 1 hour expiration
  });
  const signature = crypto.createHmac("sha256", FLOWIFY_SHARED_SECRET).update(payloadString).digest("hex");
  return Buffer.from(payloadString + "." + signature).toString("base64url");
}

export function verifyPaymentToken(token) {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const lastDotIndex = raw.lastIndexOf(".");
    if (lastDotIndex === -1) {
      throw new Error("Invalid token format");
    }
    const payloadString = raw.substring(0, lastDotIndex);
    const signature = raw.substring(lastDotIndex + 1);

    const expectedSignature = crypto
      .createHmac("sha256", FLOWIFY_SHARED_SECRET)
      .update(payloadString)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      throw new Error("Signature verification failed");
    }

    const payload = JSON.parse(payloadString);
    if (payload.exp < Date.now()) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}
