// Number of shard partitions for click analytics writes.
// Distributes write load across N documents per URL per hour to reduce contention.
const SHARD_COUNT = 10;

export function getShard() {
  return Math.floor(Math.random() * SHARD_COUNT);
}
