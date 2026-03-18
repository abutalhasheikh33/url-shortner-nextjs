import { MongoClient, Db } from "mongodb";
const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}
let client: MongoClient;
let clientPromise: Promise<MongoClient>;
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
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
export default clientPromise;
