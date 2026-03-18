import clientPromise from "@/app/lib/mongodb";
import { initDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Url from "@/models/Url";
import { Collection } from "mongodb";
import Click from "@/models/Click";
let urlCollection: Collection<Url> | null = null;
let clickCollection: Collection<Click> | null = null;
import moment from "moment";
async function getCollections() {
  if (!urlCollection) {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    await initDb(db);
    urlCollection = db.collection<Url>("urls");
    clickCollection = db.collection<Click>("clicks");
  }

  return { urlCollection, clickCollection };
}

export async function GET(
  request: Request,
  { params }: { params: { shortUrl: string } },
) {
  try {
    const { shortUrl } = await params;
    const { urlCollection, clickCollection } = await getCollections();
    const url = await urlCollection?.findOne({ shortUrl });
    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }
    await clickCollection?.updateOne(
      {
        urlId: url._id,
        date: moment.utc().format("YYYY-MM-DD"),
        hour: moment.utc().hour(),
      },
      {
        $inc: { clicks: 1 },
        $setOnInsert: {
          urlId: url._id,
          created_at: new Date(),
          date: moment.utc().format("YYYY-MM-DD"),
          hour: moment.utc().hour(),
        },
      },
      { upsert: true },
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
// export async function GET(
//   request: Request,
//   { params }: { params: { shortUrl: string } },
// ) {
//   const { shortUrl } = await params;

//   const urlCollection = await getUrlCollection();

//   const url = await urlCollection.findOne({ shortUrl });

//   if (!url) {
//     return NextResponse.json({ error: "URL not found" }, { status: 404 });
//   }

//   return NextResponse.json({ url: url.url });
// }
