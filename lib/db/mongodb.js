import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("Please add your Mongo connection string to DATABASE_URL in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
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
