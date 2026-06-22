import { createClient } from "redis";

// Singleton Redis client - reused across all requests
let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  let connectionObj = {}
  if (process.env.NODE_ENV === "production") {
    connectionObj = {
      username: "default",
      password: process.env.REDIS_PASSWORD!,
      socket: {
        host: "redis-17256.c322.us-east-1-2.ec2.cloud.redislabs.com",
        port: 17256,
      },
    }
  } else {
    connectionObj = {
      url: process.env.REDIS_URL!,
    }
  }

  if (!client) {
    client = createClient(connectionObj);

    client.on("error", (err) => console.error("Redis Error", err));

    await client.connect();
  }

  return client;
}
