import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    const { url } = await request.json();
    console.log(url);
    const shortUrl = Math.random().toString(36).substring(2, 8);
    // const urls = await db.collection("urls").insertOne({ url, shortUrl });
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 },
    );
  }
}
