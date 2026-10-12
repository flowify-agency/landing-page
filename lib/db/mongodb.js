import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

let uri = process.env.DATABASE_URL;
if (!uri) {
  try {
    const envFile = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, "utf8");
      const match = content.match(/^DATABASE_URL\s*=\s*['"]?([^'"\r\n]+)['"]?/m);
      if (match && match[1]) {
        uri = match[1].trim();
        process.env.DATABASE_URL = uri;
      }
    }
  } catch {}
}
uri = uri || "mongodb://localhost:27017/flowify-payments?directConnection=true";

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = null;
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Programmatic indexing
async function ensureIndexes(promise) {
  try {
    const conn = await promise;
    const db = conn.db();
    await db.collection("PaymentRequest").createIndex({ depositSessionId: 1 }, { unique: true });
    await db.collection("PaymentCompletion").createIndex({ depositSessionId: 1 }, { unique: true });
  } catch (err) {
    console.error("Failed to ensure gateway database indexes:", err);
  }
}
ensureIndexes(clientPromise);

export default clientPromise;
