import { Collection, ObjectId } from "mongodb";
import Click from "@/models/Click";
import moment from "moment";

export interface ClickStats {
  totalClicks: number;
  todayClicks: number;
  last24HoursClicks: number;
  thisHourClicks: number;
}

function getDateBuckets() {
  const now = moment.utc();
  const today = now.format("YYYY-MM-DD");
  const yesterday = now.clone().subtract(1, "day").format("YYYY-MM-DD");
  const currentHour = now.hour();
  return { today, yesterday, currentHour };
}

export async function getClickStats(
  urlId: ObjectId,
  clickCollection: Collection<Click>,
): Promise<ClickStats> {
  const { today, yesterday, currentHour } = getDateBuckets();

  const [totalResult, todayResult, thisHourResult, last24Result] =
    await Promise.all([
      clickCollection
        .aggregate<{ total: number }>([
          { $match: { urlId } },
          { $group: { _id: null, total: { $sum: "$clicks" } } },
        ])
        .toArray(),
      clickCollection
        .aggregate<{ total: number }>([
          { $match: { urlId, date: today } },
          { $group: { _id: null, total: { $sum: "$clicks" } } },
        ])
        .toArray(),
      clickCollection
        .aggregate<{ total: number }>([
          { $match: { urlId, date: today, hour: currentHour } },
          { $group: { _id: null, total: { $sum: "$clicks" } } },
        ])
        .toArray(),
      clickCollection
        .aggregate<{ total: number }>([
          {
            $match: {
              urlId,
              $or: [
                { date: today, hour: { $lte: currentHour } },
                { date: yesterday, hour: { $gt: currentHour } },
              ],
            },
          },
          { $group: { _id: null, total: { $sum: "$clicks" } } },
        ])
        .toArray(),
    ]);

  return {
    totalClicks: totalResult[0]?.total ?? 0,
    todayClicks: todayResult[0]?.total ?? 0,
    thisHourClicks: thisHourResult[0]?.total ?? 0,
    last24HoursClicks: last24Result[0]?.total ?? 0,
  };
}
