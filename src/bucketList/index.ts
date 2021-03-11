import { FastifyRequest } from "fastify";
import { ConfigOptions } from "../inputSchema";
import { Bucket } from "../buckets";
import { BucketData } from "../buckets";

export class BucketList {
  buckets: Bucket[];
  constructor() {
    this.buckets = [];
  }
  addBucket(bucket: Bucket): Bucket[] {
    this.buckets.push(bucket);
    return this.buckets;
  }
  dropInBucket(request: FastifyRequest): void {
    let k: keyof typeof request.cookies;
    for (k in request.cookies) {
      const cookieSz = request.cookies[k].length;
      this.buckets.forEach((bucket: Bucket) => {
        if (bucket.fitsBucket(cookieSz)) {
          bucket.addToBucket(k as string, cookieSz);
        }
      });
    }
  }
  getBuckets(): BucketData[] {
    return this.buckets.map((b) => b.getData());
  }
}

export const createBucketAggregation = (config: ConfigOptions): BucketList => {
  const cookieAgg = new BucketList();
  const orderedBuckets = config.buckets.sort((a, b) => a - b);
  let last = 0;
  for (const i of orderedBuckets) {
    cookieAgg.addBucket(new Bucket(last, i));
    last = i;
  }
  // create a catch all bucket > last number
  cookieAgg.addBucket(new Bucket(last, -1));
  return cookieAgg;
};
