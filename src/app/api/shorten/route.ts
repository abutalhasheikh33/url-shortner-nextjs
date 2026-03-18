import { NextResponse } from "next/server";
import clientPromise, { initDb } from "@/app/lib/mongodb";
import Url from "@/models/Url";
import { Collection } from "mongodb";
let urlCollection: Collection<Url> | null = null;
async function getCollections() {
  if (!urlCollection) {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    await initDb(db);
    urlCollection = db.collection<Url>("urls");
  }

  return { urlCollection };
}

export async function POST(request: Request) {
  try {
    const { urlCollection } = await getCollections();
    const { url } = await request.json();
    const shortUrl = Math.random().toString(36).substring(2, 8);
    const urlData: Url = { url, shortUrl, createdAt: new Date() };
    const existingUrl = await urlCollection?.findOne({ url });
    if (existingUrl) {
      return NextResponse.json({
        shortUrl: `http://localhost:3000/api/fetchUrl/${existingUrl.shortUrl}`,
      });
    }
    await urlCollection?.insertOne(urlData);
    return NextResponse.json({
      shortUrl: `http://localhost:3000/api/fetchUrl/${shortUrl}`,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 },
    );
  }
}
