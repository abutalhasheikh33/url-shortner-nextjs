import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

// Seed configuration: 500K records in batches of 10K to simulate production scale
const BATCH_SIZE = 10000;
const TOTAL_RECORDS = 500000;

const uri =
  "mongodb+srv://abutalhasheikh33_db_user:newpassword@cluster0.dycsamv.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function seed() {
  await client.connect();
  const db = client.db("url-shortener");
  const collection = db.collection("urls");

  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const docs = [];

    for (let j = 0; j < BATCH_SIZE; j++) {
      const shortUrl = Math.random().toString(36).substring(2, 8);
      const id = i + j;

      docs.push({
        url: `https://example.com/page/${id}`,
        shortUrl: `${shortUrl}${id}`,  // Append id to avoid collisions
        createdAt: new Date(),
        history: [{ datetime: new Date() }],
      });
    }

    await collection.insertMany(docs);
    console.log(`Inserted ${i + BATCH_SIZE}`);
  }

  console.log("Seeding completed");
  await client.close();
}

seed();
