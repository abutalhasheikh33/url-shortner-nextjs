import clientPromise from "@/app/lib/mongodb";
import { initDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Url from "@/models/Url";
export async function GET(
  request: Request,
  { params }: { params: { shortUrl: string } },
) {
  try {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    await initDb(db);
    const { shortUrl } = await params;
    const urlCollection = db.collection<Url>("urls");
    const url = await urlCollection.findOne({ shortUrl });
    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }
    await urlCollection.updateOne(
      { shortUrl },
      {
        $push: {
          history: { datetime: new Date() },
        },
      },
    );
    return NextResponse.redirect(url?.url as string);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 },
    );
  }
}
