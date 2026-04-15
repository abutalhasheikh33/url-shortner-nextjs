import { Collection } from "mongodb";
import Url from "@/models/Url";
import { getRedisClient } from "@/app/lib/redis";

const CACHE_TTL = 60 * 60; // 1 hour

export async function getUrlByShortUrl(
  shortUrl: string,
  urlCollection: Collection<Url>,
) {
  const redis = await getRedisClient();

  // 1️⃣ Try cache
  const cached = await redis.get(`url:${shortUrl}`);

  if (cached) {
    const { url, _id } = JSON.parse(cached);
    return { url, _id, source: "cache" };
  }

  // 2️⃣ Fallback to Mongo
  const urlDoc = await urlCollection.findOne({ shortUrl });

  if (!urlDoc) return null;

  // 3️⃣ Populate cache
  await redis.set(
    `url:${shortUrl}`,
    JSON.stringify({ url: urlDoc.url, _id: urlDoc._id }),
    {
      EX: CACHE_TTL,
    },
  );

  return { url: urlDoc.url, _id: urlDoc._id, source: "db" };
}
