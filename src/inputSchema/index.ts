import S from "fluent-json-schema";
import Ajv from "ajv";

export interface ConfigOptions {
  interval: number;
  buckets: number[];
}

export class Bucket {
  boundary: number;
  count: number;

  constructor(boundary: number) {
    this.boundary = boundary;
    this.count = 0;
  }
  increment(): number {
    ++this.count;
    return this.count;
  }
  getBoundary(): number {
    return this.boundary;
  }
  getCount(): number {
    return this.count;
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
}

const schema = S.object()
  .id("fastify-cookie-monster")
  .prop("interval", S.number().required())
  .prop("buckets", S.array().minItems(0).items(S.number()).required())
  .valueOf();

const validateInput = (input: ConfigOptions): boolean => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema.valueOf());
  return validate(input);
};

export { validateInput as default, schema };
