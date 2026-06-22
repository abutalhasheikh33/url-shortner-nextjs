import { getDb, initDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Url from "@/models/Url";
import { Collection, ObjectId } from "mongodb";
import Click from "@/models/Click";
import { getUrlByShortUrl } from "@/services/urlService";
import moment from "moment";
import { getShard } from "@/helpers/shard";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortUrl: string }> },
) {
  try {
    const { shortUrl } = await params;
    const { urlCollection, clickCollection } = await getCollections();

    const result = await getUrlByShortUrl(shortUrl, urlCollection);

    if (!result) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const { url, _id } = result as { url: string; _id: ObjectId };

    const shard = getShard();
    clickCollection?.updateOne(
      {
        urlId: _id,
        date: moment.utc().format("YYYY-MM-DD"),
        hour: moment.utc().hour(),
        shard: shard,
      },
      {
        $inc: { clicks: 1 },
        $setOnInsert: {
          urlId: _id,
          created_at: new Date(),
          date: moment.utc().format("YYYY-MM-DD"),
          hour: moment.utc().hour(),
          shard: shard,
        },
      },
      { upsert: true },
    );

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
