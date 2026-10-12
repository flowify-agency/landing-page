"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Check,
  LogOut,
  Users,
  CreditCard,
  RotateCcw,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Search,
  Copy,
  CheckCheck,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Layers,
  FlaskConical
} from "lucide-react";
import SmoothChart from "./components/SmoothChart";
import MethodSplitDonut from "./components/MethodSplitDonut";

const PERIOD_LABELS = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  lifetime: "Lifetime",
};

const MERCHANT_ACCOUNTS = [
  { key: "all", name: "All Accounts", badge: "Overview" },
  { key: "janardhan", name: "Janardhan", badge: "Live + Test" },
  { key: "randhir", name: "Randhir", badge: "Live + Test" },
  { key: "sanju", name: "Sanju", badge: "Test" },
  { key: "yashodanand", name: "Yashodanand", badge: "Live + Test" },
];

export default function DashboardPage() {
  const router = useRouter();

  // User state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Filter state
  const [period, setPeriod] = useState("7d");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [paymentMode, setPaymentMode] = useState("live"); // 'live' | 'test'
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Active chart tab (Collected Amount, Refunds, Orders)
  const [activeChartTab, setActiveChartTab] = useState("Collected Amount");
  const [activeTableTab, setActiveTableTab] = useState("Payments");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [stats, setStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // 1. Check Authentication on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/dashboard/auth");
        const data = await res.json();
        if (!data.user) {
          router.replace("/dashboard/login");
          return;
        }
        setUser(data.user);
        // If not admin, default selectedAccount to user's personal account
        if (data.user.role !== "admin") {
          setSelectedAccount(data.user.accountKey);
        }
      } catch (err) {
        router.replace("/dashboard/login");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch Dashboard Statistics
  const fetchStats = useCallback(async (overrideMode) => {
    if (!user) return;
    setDataLoading(true);
    try {
      const acc = user.role === "admin" ? selectedAccount : user.accountKey;
      const m = overrideMode || paymentMode;
      const res = await fetch(`/api/dashboard/stats?period=${period}&account=${acc}&mode=${m}`);
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setDataLoading(false);
    }
  }, [user, period, selectedAccount, paymentMode]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  const handleModeChange = (newMode) => {
    if (newMode === paymentMode) return;
    setPaymentMode(newMode);
    fetchStats(newMode);
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch("/api/dashboard/auth", { method: "DELETE" });
    router.replace("/dashboard/login");
  };

  // Seed demo data handler
  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/dashboard/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchStats();
      }
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered payments
  const filteredPayments = useMemo(() => {
    if (!stats?.payments) return [];
    if (!searchQuery.trim()) return stats.payments;
    const q = searchQuery.toLowerCase();
    return stats.payments.filter(
      (p) =>
        p.id?.toLowerCase().includes(q) ||
        p.paymentId?.toLowerCase().includes(q) ||
        p.orderId?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        String(p.amount).includes(q)
    );
  }, [stats?.payments, searchQuery]);

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-sans">
        <div className="flex items-center gap-2.5 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Verifying merchant session...</span>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const summary = stats?.summary || {
    collectedAmount: 0,
    capturedCount: 0,
    refundsAmount: 0,
    refundsCount: 0,
    disputesCount: 0,
    failedCount: 0,
    ordersCount: 0,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex">
      {/* =====================================================================
          SIDEBAR (Exclusive for Randhir / Admin)
          ===================================================================== */}
      {isAdmin && (
        <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col">
          {/* Brand */}
          <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
            <a href="/" className="flex items-center">
              <img
                src="/in-line-flowify.svg"
                alt="Flowify"
                className="h-7 w-auto"
              />
            </a>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400  px-2 py-0.5 rounded">
              Admin
            </span>
          </div>

          {/* User selector section */}
          <div className="p-4 flex-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Merchant Accounts</span>
            </div>

            <div className="mt-2 space-y-1">
              {MERCHANT_ACCOUNTS.map((acc) => {
                const isActive = selectedAccount === acc.key;
                return (
                  <button
                    key={acc.key}
                    onClick={() => setSelectedAccount(acc.key)}
                    className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      />
                      <span>{acc.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {acc.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper */}
            <div className="mt-8 mx-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Super Admin Mode</span>
              </div>
              <p className="mt-1 leading-relaxed text-slate-500">
                You have full access to switch between all 4 merchant accounts or view aggregate telemetry across all gateways.
              </p>
            </div>
          </div>

          {/* Test Mode Switch in Sidebar (matches user screenshot) */}
          <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <FlaskConical className={`w-[18px] h-[18px] ${paymentMode === "test" ? "text-blue-600" : "text-slate-800"}`} />
              <span className="text-[14px] font-normal text-slate-800 select-none">Test Mode</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={paymentMode === "test"}
              onClick={() => handleModeChange(paymentMode === "test" ? "live" : "test")}
              className={`relative inline-flex h-6 w-11 shrink-0 p-0.5 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                paymentMode === "test" ? "bg-[#0B63F6]" : "bg-[#ECEFF1]"
              }`}
            >
              <span
                className={`flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  paymentMode === "test" ? "translate-x-5" : "translate-x-0"
                }`}
              >
                {paymentMode === "test" && (
                  <Check className="w-3.5 h-3.5 text-[#0B63F6] stroke-[3]" />
                )}
              </span>
            </button>
          </div>

          {/* Admin User Footer in Sidebar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs">
              <div className="truncate">
                <div className="font-semibold text-slate-800 truncate">{user?.displayName}</div>
                <div className="text-[10px] text-emerald-600 font-medium">● Super Admin</div>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =====================================================================
          MAIN CONTENT AREA
          ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 md:px-8 flex items-center justify-between shrink-0 gap-2">
          {/* Left: Brand + Overview Filter */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {/* Brand logo on mobile (or for non-admin) */}
            <a href="/" className={`flex items-center mr-1 sm:mr-2 pr-2 sm:pr-3 border-r border-slate-200 shrink-0 ${isAdmin ? "md:hidden" : ""}`}>
              <img
                src="/in-line-flowify.svg"
                alt="Flowify"
                className="h-5 sm:h-6 w-auto"
              />
            </a>

            <div className="relative shrink-0">
              <button
                onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-blue-600 transition cursor-pointer whitespace-nowrap"
              >
                <span>Overview</span>
                <span className="text-blue-600 font-normal whitespace-nowrap">{PERIOD_LABELS[period]}</span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Period Dropdown */}
              {periodDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setPeriodDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-40 sm:w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-40 py-1.5 text-xs">
                    {Object.entries(PERIOD_LABELS).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => {
                          setPeriod(k);
                          setPeriodDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 sm:py-2 text-left flex items-center justify-between hover:bg-slate-50 transition cursor-pointer text-xs ${
                          period === k ? "text-blue-600 font-semibold bg-blue-50/50" : "text-slate-700"
                        }`}
                      >
                        <span>{label}</span>
                        {period === k && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header items - Account Dropdown containing accounts & Logout */}
          <div className="relative shrink-0 text-xs">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg font-semibold text-slate-800 transition cursor-pointer select-none text-xs"
            >
              <span className="truncate max-w-[100px] sm:max-w-none">
                {isAdmin
                  ? MERCHANT_ACCOUNTS.find((a) => a.key === selectedAccount)?.name || "All Accounts"
                  : user?.displayName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${accountDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {accountDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setAccountDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1.5 text-xs">
                  {/* If Admin: Merchant Accounts Header & List */}
                  {isAdmin && (
                    <>
                   
                      <div className="">
                        {MERCHANT_ACCOUNTS.map((acc) => {
                          const isActive = selectedAccount === acc.key;
                          return (
                            <button
                              key={acc.key}
                              onClick={() => {
                                setSelectedAccount(acc.key);
                                setAccountDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-1 text-left flex items-center justify-between hover:bg-slate-50 transition cursor-pointer text-xs ${
                                isActive ? "text-blue-600 font-semibold bg-blue-50/50" : "text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blue-600" : "bg-slate-300"}`} />
                                <span>{acc.name}</span>
                              </div>
                              {isActive && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </button>
                          );
                        })}
                      </div>
                      <div className="my-1.5 border-t border-slate-100" />
                    </>
                  )}

                  {/* For Non-Admin: User details preview */}
                  {!isAdmin && (
                    <div className="px-3 py-2 border-b border-slate-100 mb-0">
                      <div className="font-semibold text-slate-800">{user?.displayName}</div>
                      <div className="text-[10px] text-slate-400">{user?.phone}</div>
                    </div>
                  )}

                  {/* Logout Button inside the dropdown */}
                  <button
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-3 py-0 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition cursor-pointer font-medium text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ===================================================================
            DASHBOARD BODY
            =================================================================== */}
        <main className="p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-3.5 sm:space-y-6">
          {/* Active Account Banner */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
                {isAdmin
                  ? selectedAccount === "all"
                    ? "Combined Overview"
                    : `${MERCHANT_ACCOUNTS.find((a) => a.key === selectedAccount)?.name} Gateway`
                  : `${user?.displayName} Payments`}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Test Mode Toggle Button (matches user screenshot) */}
              <button
                type="button"
                role="switch"
                aria-checked={paymentMode === "test"}
                onClick={() => handleModeChange(paymentMode === "test" ? "live" : "test")}
                disabled={dataLoading}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none group  hover:border-slate-300"
                title={paymentMode === "test" ? "Test Mode active (click to switch to Live)" : "Live Mode active (click to switch to Test)"}
              >
                <div className="flex items-center gap-1.5">
                  <FlaskConical className={`w-[12px] h-[12px] transition-colors ${paymentMode === "test" ? "text-blue-600" : "text-slate-800"}`} />
                  <span className="text-[12px] font-normal text-slate-800 select-none">Test Mode</span>
                </div>
                <div
                  className={`relative inline-flex h-4 w-7 shrink-0 p-0.5 items-center rounded-full transition-colors duration-200 ease-in-out ${
                    paymentMode === "test" ? "bg-[#0B63F6]" : "bg-[#ECEFF1]"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center h-3 w-3 transform rounded-full bg-white shadow-2xs transition duration-200 ease-in-out ${
                      paymentMode === "test" ? "translate-x-3" : "translate-x-0"
                    }`}
                  >
                    {paymentMode === "test" && (
                      <Check className="w-2 h-2 text-[#0B63F6] stroke-[3.5]" />
                    )}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Test Mode Notification Banner */}
          {paymentMode === "test" && (
            <div className="px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-xs text-amber-900 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" /> */}
                <span>
                Viewing simulated payments.
                </span>
              </div>
             
            </div>
          )}

          {/* ===================================================================
              METRICS TOP SECTION (Matches Razorpay Screenshot 1)
              =================================================================== */}
          <div className="space-y-2 sm:space-y-4">
            {/* Big Collected Amount Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-5 md:p-6 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span>Collected Amount</span>
                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300 text-slate-400 text-[9px] sm:text-[10px] flex items-center justify-center font-serif">
                    i
                  </span>
                </div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-1 sm:mt-2 tracking-tight">
                ₹{summary.collectedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                from {summary.capturedCount} captured payment{summary.capturedCount === 1 ? "" : "s"}
              </div>
            </div>

            {/* Row of 3 Secondary Metric Cards (Refunds, Disputes, Failed) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Refunds */}
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-4 md:p-5 shadow-2xs hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Refunds</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90 hidden sm:block shrink-0" />
                </div>
                <div className="text-xs sm:text-base md:text-lg font-bold text-slate-900 mt-1 sm:mt-1.5 truncate">
                  ₹{summary.refundsAmount.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </div>
                <div className="text-[9px] sm:text-xs text-slate-400 mt-0.5 truncate">{summary.refundsCount} processed</div>
              </div>

              {/* Disputes */}
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-4 md:p-5 shadow-2xs hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Disputes</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90 hidden sm:block shrink-0" />
                </div>
                <div className="text-xs sm:text-base md:text-lg font-bold text-slate-900 mt-1 sm:mt-1.5 truncate">₹0</div>
                <div className="text-[9px] sm:text-xs text-slate-400 mt-0.5 truncate">0 open</div>
              </div>

              {/* Failed */}
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-4 md:p-5 shadow-2xs hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">Failed</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90 hidden sm:block shrink-0" />
                </div>
                <div className="text-xs sm:text-base md:text-lg font-bold text-slate-900 mt-1 sm:mt-1.5">{summary.failedCount}</div>
                <div className="text-[9px] sm:text-xs text-slate-400 mt-0.5 truncate">payments</div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              PAYMENTS OVERVIEW GRAPH CARD (Matches Razorpay Screenshot 2)
              =================================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
              <div>
                <h2 className="text-xs sm:text-base font-bold text-slate-900">Payments Overview</h2>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Flow telemetry across {PERIOD_LABELS[period]}
                </p>
              </div>

              {/* Chart Tabs (Collected Amount / Refunds / Orders) */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
                {[
                  { id: "Collected Amount", label: "Collected", val: `₹${summary.collectedAmount.toFixed(0)}` },
                  { id: "Refunds", label: "Refunds", val: `₹${summary.refundsAmount.toFixed(0)}` },
                  { id: "Orders", label: "Orders", val: String(summary.ordersCount) },
                ].map((tab) => {
                  const isActive = activeChartTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChartTab(tab.id)}
                      className={`px-2 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1 sm:gap-2 shrink-0 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[9px] sm:text-[11px] font-normal ${isActive ? "text-blue-500" : "text-slate-400"}`}>
                        ({tab.val})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smooth SVG Chart Container */}
            <div className="p-2.5 sm:p-6">
              <SmoothChart
                data={stats?.chartPoints || []}
                activeTab={activeChartTab}
                height={200}
              />

              {/* Legend matching screenshot */}
              <div className="mt-2.5 pt-2.5 sm:mt-4 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600">
                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-xs bg-blue-600 flex items-center justify-center text-white text-[8px] sm:text-[9px]">
                    ✔
                  </span>
                  <span>This Period</span>
                </div>
                <div className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer text-[10px] sm:text-xs">
                  <span>View Details</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              TOP INSIGHTS SECTION (Matches Razorpay Screenshot 2)
              =================================================================== */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-xs sm:text-base font-bold text-slate-900">Top Insights</h2>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{PERIOD_LABELS[period]}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4">
              {/* Payment Count Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span>Payment count</span>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-400 text-[8px] sm:text-[9px] flex items-center justify-center font-serif">
                        i
                      </span>
                    </div>
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5">{PERIOD_LABELS[period]}</div>
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 mt-1 sm:mt-1.5">{summary.capturedCount}</div>
                </div>
                <div className="mt-2.5 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-blue-600 font-medium">
                  <span>Details</span>
                  <span>→</span>
                </div>
              </div>

              {/* Payment Failure Count Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span>Failure count</span>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-400 text-[8px] sm:text-[9px] flex items-center justify-center font-serif">
                        i
                      </span>
                    </div>
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5">{PERIOD_LABELS[period]}</div>
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 mt-1 sm:mt-1.5">{summary.failedCount}</div>
                </div>
                <div className="mt-2.5 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-blue-600 font-medium">
                  <span>Details</span>
                  <span>→</span>
                </div>
              </div>

              {/* Refund Count Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span>Refund count</span>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-400 text-[8px] sm:text-[9px] flex items-center justify-center font-serif">
                        i
                      </span>
                    </div>
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5">{PERIOD_LABELS[period]}</div>
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 mt-1 sm:mt-1.5">0</div>
                </div>
                <div className="mt-2.5 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-blue-600 font-medium">
                  <span>Details</span>
                  <span>→</span>
                </div>
              </div>

              {/* Payment Method Split Card (Donut) */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-2xs flex flex-col justify-between col-span-2 md:col-span-1">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span>Method split</span>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-400 text-[8px] sm:text-[9px] flex items-center justify-center font-serif">
                        i
                      </span>
                    </div>
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5">{PERIOD_LABELS[period]}</div>
                  <div className="mt-2 sm:mt-4">
                    <MethodSplitDonut split={stats?.methodSplit || {}} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              PAYMENTS TABLE SECTION (Matches Razorpay Screenshot 1)
              =================================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Header Tabs & Search */}
            <div className="p-3 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
              <div className="flex items-center gap-4 sm:gap-6 border-b sm:border-b-0 border-slate-100 pb-1.5 sm:pb-0">
                {["Payments", "Orders"].map((tab) => {
                  const isActive = activeTableTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTableTab(tab)}
                      className={`text-xs sm:text-sm font-semibold relative pb-1.5 sm:pb-2 transition cursor-pointer ${
                        isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <span>{tab}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by ID, email, amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Table or Empty State */}
            {filteredPayments.length === 0 ? (
              <div className="py-12 sm:py-16 px-4 text-center">
                {/* Razorpay Empty State Icon from Screenshot 1 */}
                <div className="w-12 h-10 sm:w-16 sm:h-12 mx-auto rounded-lg bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center mb-3 sm:mb-4">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Start collecting payments</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Use Payment Links, Payment Pages, Payment Gateway, and others to collect payments from your customers.
                </p>
                <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleSeedDemoData}
                    disabled={seeding}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{seeding ? "Generating..." : "Generate Test Transactions"}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[580px] sm:min-w-full">
                  <thead className="bg-slate-50/75 border-b border-slate-100 text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4">{activeTableTab === "Orders" ? "Order ID" : "Payment ID"}</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4">Amount</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4">Status</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4">Method</th>
                      {isAdmin && selectedAccount === "all" && (
                        <th className="py-2.5 sm:py-3 px-3 sm:px-4">Account</th>
                      )}
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4">Customer</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px] sm:text-xs">
                    {filteredPayments.map((p) => {
                      const isCaptured = p.status === "captured" || p.status === "success";
                      const primaryId = activeTableTab === "Orders" ? (p.orderId || p.id) : p.paymentId;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          {/* Payment / Order ID with copy button */}
                          <td className="py-2 sm:py-3 px-3 sm:px-4 font-mono text-[10px] sm:text-[11px] font-medium text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <span className="truncate max-w-[120px] sm:max-w-none">{primaryId}</span>
                              <button
                                onClick={() => handleCopy(primaryId)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                                title={activeTableTab === "Orders" ? "Copy Order ID" : "Copy Payment ID"}
                              >
                                {copiedId === primaryId ? (
                                  <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-2 sm:py-3 px-3 sm:px-4 font-bold text-slate-900 whitespace-nowrap">
                            ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>

                          {/* Status Badge */}
                          <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <span
                                className={`inline-flex items-center py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold ${
                                  isCaptured
                                    ? "text-emerald-700"
                                    : "text-rose-700"
                                }`}
                              >
                                {isCaptured ? "Captured" : "Failed"}
                              </span>
                             
                            </div>
                          </td>

                          {/* Method */}
                          <td className="py-2 sm:py-3 px-3 sm:px-4 text-slate-600 font-medium whitespace-nowrap">{p.method}</td>

                          {/* Account (if in All view) */}
                          {isAdmin && selectedAccount === "all" && (
                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-slate-500 text-[10px] sm:text-[11px] whitespace-nowrap">
                              {p.gatewayAccountName}
                            </td>
                          )}

                          {/* Customer Email */}
                          <td className="py-2 sm:py-3 px-3 sm:px-4 text-slate-600 truncate max-w-[120px] sm:max-w-[160px]">
                            {p.email}
                          </td>

                          {/* Date */}
                          <td className="py-2 sm:py-3 px-3 sm:px-4 text-right text-slate-400 text-[10px] sm:text-[11px] whitespace-nowrap">
                            {p.date}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
