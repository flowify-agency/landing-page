#!/usr/bin/env node

/**
 * Preflight Check & Environment Bootstrapper for Flowify Landing Page & Portal
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

// 1. Ensure .env.local
const envPath = path.join(rootDir, ".env.local");
if (!fs.existsSync(envPath)) {
  console.log(`${YELLOW}⚠ [Preflight] No .env.local found in landing-page. Please verify configuration.${RESET}`);
}

// 2. Check MongoDB
const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/flowify-payments?directConnection=true";

async function checkMongo() {
  let client;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log(`${GREEN}✔ [Preflight] MongoDB connected for Flowify Gateway.${RESET}`);
  } catch (err) {
    console.log(`${YELLOW}⚠ [Preflight] MongoDB offline at ${uri}. Attempting to start...${RESET}`);
    if (process.platform === "darwin") {
      try { execSync("brew services start mongodb-community 2>/dev/null", { stdio: "ignore" }); } catch {}
    } else if (process.platform === "linux") {
      try { execSync("sudo systemctl start mongod 2>/dev/null", { stdio: "ignore" }); } catch {}
    }
  } finally {
    if (client) { try { await client.close(); } catch {} }
  }
}

checkMongo().catch(() => {});
