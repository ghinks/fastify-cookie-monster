import { ConfigOptions } from "../inputSchema";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    cookies: {
      [cookieName: string]: string;
    };
  }
}

type BucketData = {
  upperBoundary: number;
  lowerBoundary: number;
  count: number;
  average: number;
  largest: number;
  largestName: string;
};

export class Bucket {
  private data: BucketData;

  constructor(lowerBoundary: number, upperBoundary: number) {
    this.data = {
      lowerBoundary,
      upperBoundary,
      count: 0,
      average: 0,
      largest: 0,
      largestName: "",
    };
  }
  addToBucket(name: string, size: number): number {
    ++this.data.count;
    this.data.average =
      this.data.average + (1 / this.data.count) * (size - this.data.average);
    if (size >= this.data.largest) {
      this.data.largest = size;
      this.data.largestName = name;
    }
    return this.data.count;
  }
  fitsBucket(size: number): boolean {
    // last bucket is lowerbound, -1
    if (this.data.upperBoundary > 0) {
      return this.data.lowerBoundary <= size && size < this.data.upperBoundary;
    }
    return size >= this.data.lowerBoundary;
  }
  getData(): BucketData {
    return this.data;
  }
}

export class CookieAggregation {
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

export const createBucketAggregation = (
  config: ConfigOptions
): CookieAggregation => {
  const cookieAgg = new CookieAggregation();
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
