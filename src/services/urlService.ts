import { Collection } from "mongodb";
import Url from "@/models/Url";
import { getRedisClient } from "@/app/lib/redis";

// Cache-aside (lazy loading) strategy: 1-hour TTL
const CACHE_TTL = 60 * 60;
const CACHE_KEY_PREFIX = "url:";

export async function getUrlByShortUrl(
  shortUrl: string,
  urlCollection: Collection<Url>,
) {
  const redis = await getRedisClient();

  // 1. Check Redis cache first (sub-millisecond lookup)
  const cached = await redis.get(`${CACHE_KEY_PREFIX}${shortUrl}`);

  if (cached) {
    const { url, _id } = JSON.parse(cached);
    return { url, _id, source: "cache" };
  }

  // 2. On cache miss, fall back to MongoDB
  const urlDoc = await urlCollection.findOne({ shortUrl });

  if (!urlDoc) return null;

  // 3. Populate cache for subsequent requests
  await redis.set(
    `${CACHE_KEY_PREFIX}${shortUrl}`,
    JSON.stringify({ url: urlDoc.url, _id: urlDoc._id }),
    { EX: CACHE_TTL },
  );

  return { url: urlDoc.url, _id: urlDoc._id, source: "db" };
}
