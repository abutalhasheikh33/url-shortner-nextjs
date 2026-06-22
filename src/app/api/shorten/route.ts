import { NextResponse } from "next/server";
import { getDb, initDb } from "@/app/lib/mongodb";
import Url from "@/models/Url";
import { Collection } from "mongodb";

// Base URL for generated short links (should come from env in production)
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let urlCollection: Collection<Url> | null = null;

async function getCollections() {
  if (!urlCollection) {
    const db = await getDb();
    await initDb(db);
    urlCollection = db.collection<Url>("urls");
  }
  return { urlCollection };
}

// Generates a random 6-char base-36 short code (~2.17B possible combinations)
function generateShortUrl(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(request: Request) {
  try {
    const { urlCollection } = await getCollections();
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 },
      );
    }

    const shortUrl = generateShortUrl();
    const urlData: Url = { url, shortUrl, createdAt: new Date() };

    // Deduplication: return existing short URL if long URL already shortened
    const existingUrl = await urlCollection?.findOne({ url });

    if (existingUrl) {
      return NextResponse.json({
        shortUrl: `${BASE_URL}/${existingUrl.shortUrl}`,
      });
    }

    await urlCollection?.insertOne(urlData);

    return NextResponse.json({
      shortUrl: `${BASE_URL}/${shortUrl}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      { error: "Failed to create short URL" },
      { status: 500 },
    );
  }
}
