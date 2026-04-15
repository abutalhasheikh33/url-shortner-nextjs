const SHARD_COUNT = 10;

export function getShard() {
  return Math.floor(Math.random() * SHARD_COUNT);
}
