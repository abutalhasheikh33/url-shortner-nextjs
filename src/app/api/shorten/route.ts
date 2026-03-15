import { NextResponse } from "next/server";
import clientPromise, { initDb } from "@/app/lib/mongodb";
import Url from "@/models/Url";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    await initDb(db);
    const { url } = await request.json();
    console.log(url);
    const shortUrl = Math.random().toString(36).substring(2, 8);
    const urlData: Url = { url, shortUrl, createdAt: new Date(), history: [] };
    const existingUrl = await db.collection("urls").findOne({ url });
    if (existingUrl) {
      return NextResponse.json({
        shortUrl: `http://localhost:3000/${existingUrl.shortUrl}`,
      });
    }
    await db.collection("urls").insertOne(urlData);
    return NextResponse.json({ shortUrl: `http://localhost:3000/${shortUrl}` });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 },
    );
  }
}
