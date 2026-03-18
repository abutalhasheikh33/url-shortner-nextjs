import { ObjectId } from "mongodb";
export default interface Url {
  _id?: ObjectId;
  url: string;
  shortUrl: string;
  createdAt?: Date;
}
