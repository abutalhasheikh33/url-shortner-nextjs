import { ObjectId } from "mongodb";
export default interface Click {
  _id?: ObjectId;
  urlId: ObjectId;
  hour: number;
  date: string;
  clicks: number;
  createdAt?: Date;
  shard: number;
}
