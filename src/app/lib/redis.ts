import { createClient } from "redis";

// Singleton Redis client - reused across all requests
let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL, // e.g. redis://localhost:6379
    });

    client.on("error", (err) => console.error("Redis Error", err));

    await client.connect();
  }

  return client;
}
