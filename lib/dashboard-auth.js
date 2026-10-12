import crypto from "node:crypto";

const DEFAULT_USERS = [
  { name: "janardhan", displayName: "Janardhan", phone: "8797047088", role: "merchant", accountKey: "janardhan" },
  { name: "sanju", displayName: "Sanju", phone: "9296741525", role: "merchant", accountKey: "sanju" },
  { name: "yashoanand", displayName: "Yashodanand", aliases: ["yashodanand", "yasho"], phone: "9693733147", role: "merchant", accountKey: "yashodanand" },
  { name: "randhir", displayName: "Randhir Kumar", aliases: ["randhirkumar", "randhir"], phone: "8008439762", role: "admin", accountKey: "randhir" }
];

export function normalizeName(str = "") {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function normalizePhone(str = "") {
  return String(str)
    .trim()
    .replace(/[^0-9]/g, "");
}

export function getDashboardUsers() {
  const raw = process.env.DASHBOARD_USERS;
  if (!raw) return DEFAULT_USERS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.warn("Failed to parse DASHBOARD_USERS from environment, using defaults:", err.message);
  }
  return DEFAULT_USERS;
}

export function authenticateMerchant(rawName = "", rawPhone = "") {
  const nameNorm = normalizeName(rawName);
  const phoneNorm = normalizePhone(rawPhone);

  if (!nameNorm || !phoneNorm) return null;

  const users = getDashboardUsers();

  for (const u of users) {
    const userPhoneNorm = normalizePhone(u.phone);
    if (userPhoneNorm !== phoneNorm) continue;

    const targetNames = [
      normalizeName(u.name),
      normalizeName(u.displayName),
      ...(u.aliases ? u.aliases.map(normalizeName) : [])
    ];

    // Flexible match: exact normalized match, or one starts with / contains the other
    const isMatch = targetNames.some(t => 
      t === nameNorm || 
      t.startsWith(nameNorm) || 
      nameNorm.startsWith(t)
    );

    if (isMatch) {
      return {
        name: u.name,
        displayName: u.displayName || u.name,
        phone: u.phone,
        role: u.role || (normalizeName(u.name) === "randhir" ? "admin" : "merchant"),
        accountKey: u.accountKey || normalizeName(u.name)
      };
    }
  }

  return null;
}

const SECRET = process.env.DASHBOARD_JWT_SECRET || "flowify-payment-dashboard-secret-2026";

export function signDashboardToken(user) {
  const payload = {
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(str).digest("base64url");
  return `${str}.${sig}`;
}

// Simple in-memory rate limiter for login protection
const loginAttempts = new Map();

export function checkLoginRateLimit(identifier = "global") {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  const record = loginAttempts.get(identifier) || { count: 0, firstAttempt: now };
  if (now - record.firstAttempt > windowMs) {
    record.count = 1;
    record.firstAttempt = now;
    loginAttempts.set(identifier, record);
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  loginAttempts.set(identifier, record);
  return { allowed: true };
}

export function resetLoginRateLimit(identifier = "global") {
  loginAttempts.delete(identifier);
}

export function verifyDashboardToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  try {
    const [str, sig] = parts;
    const expected = crypto.createHmac("sha256", SECRET).update(str).digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(str, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
