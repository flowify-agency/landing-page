"use client";

import { useState, useEffect, use, useRef } from "react";
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Check 
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/base/buttons/button";

const VERIFIED_TICK_URL = "https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png";

export default function CheckoutPage({ params }) {
  const { token } = use(params);
  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState("idle"); // idle | loading | success
  const [status, setStatus] = useState("idle"); // idle | processing | success | failed | error
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const hasOpened = useRef(false);

  // 1. Decode token on mount & verify expiration
  useEffect(() => {
    if (token) {
      try {
        let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        const decoded = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const lastDotIndex = decoded.lastIndexOf(".");
        if (lastDotIndex === -1) {
          throw new Error("Invalid token format");
        }
        const payloadString = decoded.substring(0, lastDotIndex);
        const data = JSON.parse(payloadString);

        if (data.exp && data.exp < Date.now()) {
          setErrorMessage("This payment session has expired. Please restart from Win & Spin.");
          setStatus("error");
          return;
        }

        setPaymentDetails(data);
      } catch (err) {
        console.error("Error decoding token on client:", err);
        setErrorMessage("Invalid payment token. Please try restarting your deposit from the merchant app.");
        setStatus("error");
      }
    }
  }, [token]);

  // 2. Load Razorpay Script dynamically
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Razorpay) {
        setIsScriptLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay Checkout SDK");
        setErrorMessage("Failed to load payment gateway script. Please check your connection.");
        setStatus("error");
      };
      document.body.appendChild(script);
    }
  }, []);

  const triggerConfetti = () => {
    try {
      const colors = ["#00b05b", "#10b981", "#34d399", "#fbbf24", "#ffffff"];
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: 99999,
        scalar: 0.85,
        ticks: 200,
      });
    } catch (e) {
      console.error("Confetti trigger error:", e);
    }
  };

  const hasRedirected = useRef(false);

  const performRedirect = (outcome = "success") => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    try {
      if (paymentDetails?.callbackUrl) {
        // Support relative, localhost, and full tunnel URLs reliably
        const redirectUrl = new URL(paymentDetails.callbackUrl, window.location.origin);
        // Ensure safe protocol
        if (!["http:", "https:"].includes(redirectUrl.protocol)) {
          throw new Error("Invalid redirect protocol");
        }
        redirectUrl.searchParams.set("status", outcome);
        if (paymentDetails.depositSessionId) {
          redirectUrl.searchParams.set("sessionId", paymentDetails.depositSessionId);
        }
        if (paymentDetails.amount) {
          redirectUrl.searchParams.set("amount", paymentDetails.amount.toString());
        }
        if (paymentDetails.isMandate) {
          redirectUrl.searchParams.set("isMandate", "true");
          if (paymentDetails.subscriptionPlan) {
            redirectUrl.searchParams.set("subscriptionPlan", paymentDetails.subscriptionPlan);
          }
        }
        window.location.replace(redirectUrl.toString());
        return;
      }
    } catch (e) {
      console.error("Redirect URL creation failed:", e);
    }

    if (paymentDetails?.callbackUrl && /^https?:\/\//i.test(paymentDetails.callbackUrl)) {
      window.location.href = paymentDetails.callbackUrl;
    } else {
      window.history.back();
    }
  };

  // ── Absolute Hard Redirect Watchdog ──
  // If user stays in success state for more than 3.2 seconds, forcefully redirect them back
  useEffect(() => {
    if (status === "success") {
      const forceRedirectTimer = setTimeout(() => {
        console.log("Watchdog: Force redirecting user to merchant");
        performRedirect("success");
      }, 3200);

      return () => clearTimeout(forceRedirectTimer);
    }
  }, [status, paymentDetails]);

  const handleCompletePayment = (outcome, razorpayPaymentId = null) => {
    if (!paymentDetails) return;
    setLoading(true);

    if (outcome === "success") {
      setStatus("success");
      triggerConfetti();
    } else {
      setStatus("failed");
      setButtonState("idle");
    }

    // 1. Fire-and-forget notification to Flowify backend with keepalive
    // This runs completely in background and informs backend even on failure
    try {
      fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status: outcome, razorpayPaymentId }),
        keepalive: true,
      }).catch((err) => {
        console.warn("Background complete notification warning:", err);
      });
    } catch (err) {
      console.warn("Payment complete dispatch error:", err);
    }

    // 2. Smooth timed redirect so the user sees the confirmation card & confetti
    if (outcome === "success") {
      setTimeout(() => {
        performRedirect(outcome);
      }, 1800);
    } else {
      setLoading(false);
    }
  };

  const handleRealPayment = async () => {
    if (!paymentDetails || !window.Razorpay) return;
    setLoading(true);
    setButtonState("loading");

    try {
      // 1. Create order on Flowify backend
      const response = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to initiate Razorpay order.");
      }

      const orderData = await response.json();

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: Math.round(Number(paymentDetails.amount) * 100),
        currency: "INR",
        name: "Flowify Billing Services",
        description: `Deposit Session: ${paymentDetails.depositSessionId}`,
        image: "https://www.flowify.agency/favicon.png",
        order_id: orderData.id,
        handler: async function (response) {
          setStatus("success");
          triggerConfetti();
          await handleCompletePayment("success", response.razorpay_payment_id);
        },
        prefill: {
          email: paymentDetails.email,
        },
        theme: {
          color: "#00b05b", // Flowify / Win & Spin emerald green
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setButtonState("idle");
            setStatus("failed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Checkout Error:", err);
      setErrorMessage(err.message || "Could not launch Razorpay Checkout gateway.");
      setStatus("error");
      setLoading(false);
      setButtonState("idle");
    }
  };

  // 3. Auto-trigger payment as soon as page loads and SDK is ready
  useEffect(() => {
    if (paymentDetails && isScriptLoaded && !hasOpened.current) {
      hasOpened.current = true;
      handleRealPayment();
    }
  }, [paymentDetails, isScriptLoaded]);

  const handleReturnToMerchant = (outcome = "failed") => {
    // Notify Flowify gateway with keepalive so cancellation is recorded in DB
    try {
      if (token) {
        fetch("/api/payment/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, status: outcome }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("Failed to notify payment cancellation:", e);
    }

    performRedirect(outcome);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col items-center justify-center p-4 font-sans select-none antialiased">
      <div className="relative w-full max-w-[420px] bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 pt-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt="Flowify"
              className="w-9 h-9 rounded-xl object-contain"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">flowify</span>
                <img 
                  src={VERIFIED_TICK_URL} 
                  alt="Verified" 
                  className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Centralized Payment Portal</p>
            </div>
          </div>
        </div>

        {/* Merchant & Order Details */}
        {paymentDetails && (
          <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Win & Spin</p>
                    <img 
                      src={VERIFIED_TICK_URL} 
                      alt="Verified" 
                      className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Verified Merchant</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1da1f3] px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3 stroke-[3]" />
                Verified
              </span>
            </div>

            <div className="border-t border-slate-200/60 pt-2.5 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex justify-between items-center">
                <span>Account</span>
                <span className="font-medium text-slate-700 font-mono truncate max-w-[190px]">{paymentDetails?.email || "Player"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Order ID</span>
                <span className="font-mono text-slate-400 text-[11px] truncate max-w-[150px]">{paymentDetails?.depositSessionId || "..."}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STATE 1: ERROR STATE ── */}
        {status === "error" && (
          <>
            <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <img 
                src="/closed.svg" 
                alt="Unable to Process" 
                className="w-24 h-24 object-contain mix-blend-multiply"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Unable to Process</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {errorMessage || "Payment link is invalid or expired. Please restart from Win & Spin."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => handleReturnToMerchant("error")}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all cursor-pointer text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="inline-flex items-center gap-1">
                  <span>Return to Win & Spin</span>
                  <img 
                    src={VERIFIED_TICK_URL} 
                    alt="Verified" 
                    className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                  />
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── STATE 2: FAILED / CANCELLED STATE ── */}
        {status === "failed" && (
          <>
            <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <img 
                src="/payment-cancelled.png" 
                alt="Payment Cancelled" 
                className="w-24 h-24 object-contain mix-blend-multiply"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Payment Cancelled</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  No charges were made to your account.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                onClick={() => {
                  setStatus("idle");
                  handleRealPayment();
                }}
                disabled={!isScriptLoaded}
                color="primary"
                size="xl"
                iconTrailing={ArrowRight}
                className="w-full h-12 rounded-2xl text-[14px] font-extrabold shadow-lg shadow-emerald-500/25 active:scale-[0.99]"
              >
                <span>Try Again</span>
              </Button>

              <button
                onClick={() => handleReturnToMerchant("failed")}
                className="w-full h-9 text-slate-400 hover:text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="inline-flex items-center gap-1">
                  <span>Return to Win & Spin</span>
                  <img 
                    src={VERIFIED_TICK_URL} 
                    alt="Verified" 
                    className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                  />
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── STATE 3: SUCCESS STATE (REDIRECTING) ── */}
        {status === "success" && (
          <>
            <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <img 
                src="/payment-success.png" 
                alt="Payment Successful" 
                className="w-24 h-24 object-contain mix-blend-multiply"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Payment Confirmed</span>
                <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  ₹{Number(paymentDetails?.amount || 0).toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Credited directly to your player wallet
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => performRedirect("success")}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl py-2.5 px-3 text-xs text-slate-600 flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.99] cursor-pointer"
                title="Click to return to Win & Spin immediately"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00b05b]" />
                <span className="inline-flex items-center gap-1">
                  <span>Returning to Win & Spin</span>
                  <img 
                    src={VERIFIED_TICK_URL} 
                    alt="Verified" 
                    className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                  />
                  <span>...</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => performRedirect("success")}
                className="text-[11px] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Taking too long?</span>
                <span className="text-[#00b05b] font-semibold underline">Click here to return</span>
              </button>
            </div>
          </>
        )}

        {/* ── STATE 4: NORMAL CHECKOUT (IDLE) ── */}
        {status === "idle" && (
          <>
            {/* Total Payable Box */}
            <div className="flex flex-col items-center justify-center py-2 bg-gradient-to-b from-slate-50/50 to-white border border-slate-100 rounded-2xl p-4">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Total Payable</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ₹{Number(paymentDetails?.amount || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">INR</span>
              </div>
              {paymentDetails?.isMandate && (
                <span className="mt-1 text-[10px] font-bold  px-2 py-0.5 rounded-full">
                  VIP Subscription Recharge
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                onClick={handleRealPayment}
                disabled={!isScriptLoaded || buttonState === "loading" || buttonState === "success"}
                isLoading={buttonState === "loading"}
                isSuccess={buttonState === "success"}
                showTextWhileLoading
                color="primary"
                size="xl"
                iconTrailing={ArrowRight}
                className={`w-full h-12 rounded-2xl text-[14px] font-extrabold shadow-lg transition-all duration-500 ${
                  buttonState === "success"
                    ? "!bg-emerald-600 !shadow-emerald-500/40 ring-4 ring-emerald-500/25 scale-[1.01]"
                    : buttonState === "loading"
                    ? "opacity-95 cursor-wait"
                    : "hover:shadow-emerald-500/35 active:scale-[0.99]"
                }`}
              >
                {buttonState === "success" ? (
                  <span>Payment Successful!</span>
                ) : buttonState === "loading" ? (
                  <span></span>
                ) : (
                  <span>Pay</span>
                )}
              </Button>

              <button
                onClick={() => setStatus("failed")}
                disabled={loading || buttonState === "loading"}
                className="w-full h-9 text-slate-400 hover:text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel and return</span>
              </button>
            </div>
          </>
        )}

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-900 border-t border-slate-100 pt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00b05b]" />
          <span>Secured by Flowify Billing Gateway & Razorpay</span>
        </div>

      </div>
    </div>
  );
}
