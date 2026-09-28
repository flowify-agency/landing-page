"use client";

import React, { useState } from "react";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  Sparkles,
  Play, 
  RotateCcw, 
  LayoutGrid, 
  Layers 
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/base/buttons/button";

export default function CheckoutTestPage() {
  const [activeTab, setActiveTab] = useState("interactive"); // interactive | grid | idle | loading | success_button | failed | error | success_card
  const [buttonState, setButtonState] = useState("idle"); // idle | loading | success
  const [currentViewStatus, setCurrentViewStatus] = useState("idle"); // idle | failed | error | success

  const sampleData = {
    amount: 300,
    email: "thilak8797@gmail.com",
    depositSessionId: "5943cbc6-d378-48c4-8b...",
    isMandate: false,
  };

  const triggerConfetti = () => {
    try {
      const colors = ["#00b05b", "#10b981", "#34d399", "#fbbf24", "#ffffff"];
      confetti({
        particleCount: 350,
        spread: 60,
        origin: { y: 0.7 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: 99999,
        scalar: 0.85,
        ticks: 200,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const runSimulation = () => {
    setCurrentViewStatus("idle");
    setButtonState("loading");

    setTimeout(() => {
      triggerConfetti();
      setCurrentViewStatus("success");
    }, 1200);
  };

  const resetAll = () => {
    setButtonState("idle");
    setCurrentViewStatus("idle");
  };

  // Reusable Checkout Card component for individual states
  const CheckoutCardWrapper = ({ 
    state = "idle", 
    btnState = "idle", 
    title = "",
    onBtnClick = () => {},
    onCancelClick = () => {}
  }) => {
    return (
      <div className="relative w-full max-w-[420px] bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-5 text-slate-900 font-sans select-none antialiased">
        
        {/* State Label Tag if supplied */}
        {title && (
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              {title}
            </span>
          </div>
        )}

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
                  src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png" 
                  alt="Verified" 
                  className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Centralized Payment Portal</p>
            </div>
          </div>
        </div>

        {/* Merchant & Order Details */}
        <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Win & Spin</p>
                  <img 
                    src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png" 
                    alt="Verified" 
                    className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Verified Merchant</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#138cd7] px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 stroke-[3]" />
              Verified
            </span>
          </div>

          <div className="border-t border-slate-200/60 pt-2.5 flex flex-col gap-1.5 text-xs text-slate-500">
            <div className="flex justify-between items-center">
              <span>Account</span>
              <span className="font-medium text-slate-700 font-mono truncate max-w-[190px]">{sampleData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Order ID</span>
              <span className="font-mono text-slate-400 text-[11px] truncate max-w-[150px]">{sampleData.depositSessionId}</span>
            </div>
          </div>
        </div>

        {/* ── STATE A: ERROR ── */}
        {state === "error" && (
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
                  Payment session is invalid or has expired. Please restart from{" "}
                  <span className="inline-flex items-center gap-0.5 font-semibold text-slate-600">
                    <span>Win & Spin</span>
                    <img 
                      src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png" 
                      alt="Verified" 
                      className="w-3 h-3 object-contain inline-block shrink-0"
                    />
                  </span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => alert("Simulated: Return to Win & Spin")}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all cursor-pointer text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="inline-flex items-center gap-1">
                  <span>Return to Win & Spin</span>
                  <img 
                    src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png" 
                    alt="Verified" 
                    className="w-3.5 h-3.5 object-contain inline-block shrink-0"
                  />
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── STATE B: CANCELLED / FAILED ── */}
        {state === "failed" && (
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
                  alert("Simulated: Reopening Gateway...");
                  onBtnClick();
                }}
                color="primary"
                size="xl"
                iconTrailing={ArrowRight}
                className="w-full h-12 rounded-2xl text-[14px] font-extrabold shadow-lg shadow-emerald-500/25 active:scale-[0.99]"
              >
                <span>Try Again</span>
              </Button>

              <button
                onClick={() => alert("Simulated: Return to Win & Spin")}
                className="w-full h-9 text-slate-400 hover:text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="inline-flex items-center gap-1">
                  <span>Return to Win & Spin</span>
                  <img 
                    src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png" 
                    alt="Verified" 
                    className="w-3 h-3 object-contain inline-block shrink-0"
                  />
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── STATE C: SUCCESS REDIRECTING ── */}
        {state === "success" && (
          <>
            <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <img 
                src="/payment-success.png" 
                alt="Payment Confirmed" 
                className="w-24 h-24 object-contain mix-blend-multiply"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Payment Confirmed</span>
                <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  ₹300
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Credited directly to your player wallet
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => alert("Simulated: Returning to Win & Spin lobby")}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl py-2.5 px-3 text-xs text-slate-600 flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.99] cursor-pointer"
                title="Click to return to Win & Spin immediately"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00b05b]" />
                <span className="inline-flex items-center gap-1">
                  <span>Returning to Win & Spin</span>
                  <img 
                    src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-instagram-bule-tick-insta-blue-star-vector-png-image_6695210.png" 
                    alt="Verified" 
                    className="w-3 h-3 object-contain inline-block shrink-0"
                  />
                  <span>...</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => alert("Simulated: Manual redirect link clicked")}
                className="text-[11px] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Taking too long?</span>
                <span className="text-[#00b05b] font-semibold underline">Click here to return</span>
              </button>
            </div>
          </>
        )}

        {/* ── STATE D: NORMAL CHECKOUT (IDLE / BUTTON ANIMATIONS) ── */}
        {state === "idle" && (
          <>
            {/* Total Payable Box */}
            <div className="flex flex-col items-center justify-center py-2 bg-gradient-to-b from-slate-50/50 to-white border border-slate-100 rounded-2xl p-4">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Total Payable</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ₹300
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">INR</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                onClick={onBtnClick}
                isLoading={btnState === "loading"}
                isSuccess={btnState === "success"}
                showTextWhileLoading
                color="primary"
                size="xl"
                iconTrailing={ArrowRight}
                className={`w-full h-12 rounded-2xl text-[14px] font-extrabold shadow-lg transition-all duration-500 ${
                  btnState === "success"
                    ? "!bg-emerald-600 !shadow-emerald-500/40 ring-4 ring-emerald-500/25 scale-[1.01]"
                    : btnState === "loading"
                    ? "opacity-95 cursor-wait"
                    : "hover:shadow-emerald-500/35 active:scale-[0.99]"
                }`}
              >
                {btnState === "success" ? (
                  <span>Payment Successful!</span>
                ) : btnState === "loading" ? (
                  <span></span>
                ) : (
                  <span>Pay</span>
                )}
              </Button>

              <button
                onClick={onCancelClick}
                className="w-full h-9 text-slate-400 hover:text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col items-center py-10 px-4 font-sans select-none antialiased">
      
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Top Controls Header */}
      <header className="relative z-10 w-full max-w-4xl bg-white border border-slate-200/80 rounded-3xl p-5 shadow-lg shadow-slate-200/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Flowify Checkout States Showcase</h1>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">v1.2</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Test, inspect, and simulate every state and animation</p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runSimulation}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Live Flow</span>
          </button>

          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Mode Selector Tabs */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-center gap-1.5 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("interactive")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "interactive" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          ⚡ Live Interactive
        </button>
        <button
          onClick={() => setActiveTab("grid")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "grid" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Side-by-Side Grid</span>
        </button>
        <button
          onClick={() => setActiveTab("idle")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "idle" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          1. Idle (Pay)
        </button>
        <button
          onClick={() => setActiveTab("loading")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "loading" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          2. Button Spinner
        </button>
        <button
          onClick={() => {
            setActiveTab("success_card");
            triggerConfetti();
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "success_card" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          3. Success Card 🎉
        </button>
        <button
          onClick={() => setActiveTab("failed")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "failed" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          4. Cancelled State
        </button>
        <button
          onClick={() => setActiveTab("error")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "error" 
              ? "bg-slate-900 text-white shadow-md" 
              : "bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60"
          }`}
        >
          5. Error State
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <main className="relative z-10 w-full flex items-center justify-center">

        {/* 1. Interactive Sandbox Mode */}
        {activeTab === "interactive" && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00b05b]" />
              <span>Click <strong>&quot;Pay →&quot;</strong> to watch it load and open the <strong>Success Card</strong> with Confetti!</span>
            </div>

            <CheckoutCardWrapper
              state={currentViewStatus}
              btnState={buttonState}
              onBtnClick={() => {
                if (currentViewStatus !== "idle" || buttonState !== "idle") {
                  resetAll();
                  return;
                }
                setButtonState("loading");
                setTimeout(() => {
                  triggerConfetti();
                  setCurrentViewStatus("success");
                }, 1200);
              }}
              onCancelClick={() => {
                setCurrentViewStatus("failed");
              }}
            />
          </div>
        )}

        {/* 2. Side by side Grid Mode */}
        {activeTab === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            <CheckoutCardWrapper state="idle" btnState="idle" title="1. Normal Idle State" />
            <CheckoutCardWrapper state="idle" btnState="loading" title="2. Loading Spinner State" />
            <CheckoutCardWrapper state="success" title="3. Payment Confirmed (Success Card)" />
            <CheckoutCardWrapper state="failed" title="4. Cancelled State" />
            <CheckoutCardWrapper state="error" title="5. Error State" />
          </div>
        )}

        {/* 3. Individual State Previews */}
        {activeTab === "idle" && (
          <CheckoutCardWrapper state="idle" btnState="idle" title="State: Normal Idle Checkout" />
        )}

        {activeTab === "loading" && (
          <CheckoutCardWrapper state="idle" btnState="loading" title="State: Button Processing Spinner" />
        )}

        {activeTab === "success_card" && (
          <CheckoutCardWrapper state="success" title="State: Payment Confirmed (Success Card)" />
        )}

        {activeTab === "failed" && (
          <CheckoutCardWrapper state="failed" title="State: Payment Cancelled" />
        )}

        {activeTab === "error" && (
          <CheckoutCardWrapper state="error" title="State: Payment Session Error" />
        )}

      </main>

    </div>
  );
}
