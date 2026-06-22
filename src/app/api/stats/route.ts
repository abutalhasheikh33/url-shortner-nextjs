import { NextResponse } from "next/server";
import { getDb, initDb } from "@/app/lib/mongodb";
import Url from "@/models/Url";
import Click from "@/models/Click";
import { Collection } from "mongodb";
import { getClickStats } from "@/services/statsService";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let urlCollection: Collection<Url> | null = null;
let clickCollection: Collection<Click> | null = null;

async function getCollections() {
  if (!urlCollection) {
    const db = await getDb();
    await initDb(db);
    urlCollection = db.collection<Url>("urls");
    clickCollection = db.collection<Click>("clicks");
  }
  return { urlCollection, clickCollection };
}

function extractShortCode(input: string): string {
  const trimmed = input.trim();

  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    return parts[parts.length - 1];
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const { shortUrl } = await request.json();

    if (!shortUrl) {
      return NextResponse.json(
        { error: "shortUrl is required" },
        { status: 400 },
      );
    }

    const code = extractShortCode(shortUrl);
    const { urlCollection, clickCollection } = await getCollections();

    const urlDoc = await urlCollection.findOne({ shortUrl: code });

    if (!urlDoc || !urlDoc._id) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    if (!clickCollection) {
      return NextResponse.json(
        { error: "Unable to fetch stats" },
        { status: 500 },
      );
    }

    const stats = await getClickStats(urlDoc._id, clickCollection);

    return NextResponse.json({
      shortUrl: code,
      ...stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Unable to fetch stats" },
      { status: 500 },
    );
  }
}
