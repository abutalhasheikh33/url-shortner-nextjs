import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://abutalhasheikh33_db_user:newpassword@cluster0.dycsamv.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function seed() {
  await client.connect();
  const db = client.db("url-shortener");
  const collection = db.collection("urls");

  const batchSize = 10000;
  const totalRecords = 500000;

  for (let i = 0; i < totalRecords; i += batchSize) {
    const docs = [];

    for (let j = 0; j < batchSize; j++) {
      const shortUrl = Math.random().toString(36).substring(2, 8);
      const id = i + j;

      docs.push({
        url: `https://example.com/page/${id}`,
        shortUrl: `${shortUrl}${id}`,
        createdAt: new Date(),
        history: [
          {
            datetime: new Date(),
          },
        ],
      });
    }

    await collection.insertMany(docs);
    console.log(`Inserted ${i + batchSize}`);
  }

  console.log("Seeding completed");
  await client.close();
}

seed();
