# URL Shortener

A high-performance URL shortener built with **Next.js 16**, **MongoDB**, and **Redis**. Designed for scale with cache-aside caching and application-level sharding for click analytics.

## Tech Stack

- **Next.js 16** (App Router) — Full-stack framework
- **MongoDB** — Primary data store
- **Redis** — In-memory cache for URL lookups
- **Docker Compose** — Local dev environment

## Features

- **URL Shortening** — `POST /api/shorten` creates a 6-char short code
- **Redirection** — `GET /:shortUrl` redirects with HTTP 307
- **Click Analytics** — Tracks clicks with sharded upserts to avoid write hotspots
- **Redis Cache-Aside** — Sub-millisecond lookups for popular URLs
- **Deduplication** — Same long URL always returns the same short code

## Quick Start

```bash
# Start local MongoDB + Redis
docker compose up -d

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production:** [https://url-shortner-nextjs-seven.vercel.app](https://url-shortner-nextjs-seven.vercel.app)

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Base URL for generated short links |
| `MONGODB_URI` | `mongodb://localhost:27017/url-shortner` | MongoDB connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |

## Architecture

- **Next.js App Router** serves both the React frontend and API routes
- **Cache-Aside Pattern**: Redis is checked first on redirect; on miss, MongoDB is queried and the result is cached with a 1-hour TTL
- **Click Sharding**: Each click is randomly assigned to 1 of 10 shards to distribute write load and prevent document-level contention on popular URLs

## Testing

```bash
npm test
```
