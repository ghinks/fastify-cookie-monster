import { Bucket, ConfigOptions, CookieAggregation } from "../inputSchema";

export const createBuckets = (config: ConfigOptions): CookieAggregation => {
  const cookieAgg = new CookieAggregation();
  for (const i of config.buckets) {
    cookieAgg.addBucket(new Bucket(i));
  }
  return cookieAgg;
};
