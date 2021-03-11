// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    cookies: {
      [cookieName: string]: string;
    };
  }
}

export type BucketData = {
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
