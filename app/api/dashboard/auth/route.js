import { NextResponse } from "next/server";
import { 
  authenticateMerchant, 
  signDashboardToken, 
  verifyDashboardToken, 
  getDashboardUsers,
  checkLoginRateLimit,
  resetLoginRateLimit 
} from "../../../../lib/dashboard-auth.js";

const COOKIE_NAME = "flowify_merchant_token";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown-ip";
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "TOO_MANY_ATTEMPTS", message: `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, phone } = body || {};

    if (!name || !phone) {
      return NextResponse.json(
        { error: "VALIDATION", message: "Both account name and phone number are required." },
        { status: 400 }
      );
    }

    const user = authenticateMerchant(name, phone);
    if (!user) {
      return NextResponse.json(
        { error: "INVALID_CREDENTIALS", message: "Invalid account name or phone number." },
        { status: 401 }
      );
    }

    resetLoginRateLimit(ip);

    const token = signDashboardToken(user);
    const res = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        displayName: user.displayName,
        phone: user.phone,
        role: user.role,
        accountKey: user.accountKey,
        availableAccounts: user.role === "admin" 
          ? getDashboardUsers().map(u => ({ accountKey: u.accountKey, displayName: u.displayName }))
          : [{ accountKey: user.accountKey, displayName: user.displayName }]
      }
    });

    res.cookies.set(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return res;
  } catch (err) {
    console.error("Dashboard auth POST error:", err);
    return NextResponse.json({ error: "INTERNAL", message: "Authentication failed." }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = verifyDashboardToken(token);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        displayName: user.displayName,
        phone: user.phone,
        role: user.role,
        accountKey: user.accountKey,
        availableAccounts: user.role === "admin" 
          ? getDashboardUsers().map(u => ({ accountKey: u.accountKey, displayName: u.displayName }))
          : [{ accountKey: user.accountKey, displayName: user.displayName }]
      }
    });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0)
  });
  return res;
}
