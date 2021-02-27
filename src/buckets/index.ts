import { ConfigOptions } from "../inputSchema";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    cookies: {
      [cookieName: string]: string;
    };
  }
}
export class Bucket {
  private upperBoundary: number;
  private lowerBoundary: number;
  private count: number;
  private average: number;
  private largest: number;
  private largestName: string;

  constructor(lowerBoundary: number, upperBoundary: number) {
    this.lowerBoundary = lowerBoundary;
    this.upperBoundary = upperBoundary;
    this.count = 0;
    this.average = 0;
    this.largest = 0;
    this.largestName = "";
  }
  addToBucket(name: string, size: number): number {
    ++this.count;
    this.average = this.average + (1 / this.count) * (size - this.average);
    if (size >= this.largest) {
      this.largest = size;
      this.largestName = name;
    }
    return this.count;
  }
  getLargest(): number {
    return this.largest;
  }
  getLargestName(): string {
    return this.largestName;
  }
  getUpperBoundary(): number {
    return this.upperBoundary;
  }
  getLowerBoundary(): number {
    return this.lowerBoundary;
  }
  getCount(): number {
    return this.count;
  }
  getAverage(): number {
    return this.average;
  }
  fitsBucket(size: number): boolean {
    // last bucket is lowerbound, -1
    if (this.upperBoundary > 0) {
      return this.lowerBoundary <= size && size < this.upperBoundary;
    }
    return size >= this.lowerBoundary;
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
}

export const createBuckets = (config: ConfigOptions): CookieAggregation => {
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
