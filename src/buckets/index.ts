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
    if (
      upperBoundary > Number.MAX_SAFE_INTEGER ||
      lowerBoundary > Number.MAX_SAFE_INTEGER
    ) {
      throw new Error("integer out of range");
    }
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
    if (this.data.count === Number.MAX_SAFE_INTEGER) {
      this.data.count = 0;
    }
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
    return this.data.lowerBoundary <= size && size < this.data.upperBoundary;
  }
  getData(): BucketData {
    return this.data;
  }
}
