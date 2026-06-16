import { ObjectId } from "mongodb";

// Schema for the `clicks` collection - sharded click analytics per URL per hour
export default interface Click {
  _id?: ObjectId;
  urlId: ObjectId;       // Reference to urls._id
  hour: number;          // UTC hour of the click (0-23)
  date: string;          // UTC date string "YYYY-MM-DD"
  clicks: number;        // Running click count (incremented via $inc)
  createdAt?: Date;
  shard: number;         // Shard partition (0-9) for write distribution
}
