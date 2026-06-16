import { ObjectId } from "mongodb";

// Schema for the `urls` collection - maps short codes to original URLs
export default interface Url {
  _id?: ObjectId;
  url: string;           // Original long URL
  shortUrl: string;      // 6-char base-36 short code
  createdAt?: Date;
}
