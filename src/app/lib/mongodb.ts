import { MongoClient, Db } from "mongodb";

const DB_NAME = "url-shortener";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }
  return uri;
}

export const initDb = async (db: Db) => {
  const collections = await db.listCollections().toArray();
  const names = collections.map((c) => c.name);

  if (!names.includes("urls")) {
    await db.createCollection("urls");
  }
  if (!names.includes("clicks")) {
    await db.createCollection("clicks");
  }
};

export const getDb = async () => {
  if (!clientPromise) {
    const uri = getUri();
    const client = new MongoClient(uri);

    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      clientPromise = client.connect();
    }
  }

  const client = await clientPromise;
  return client.db(DB_NAME);
};

export default clientPromise;
