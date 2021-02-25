import { Bucket, ConfigOptions, CookieAggregation } from "../inputSchema";
import {
  FastifyRequest,
  FastifyInstance,
  FastifyReply,
  HookHandlerDoneFunction,
} from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    cookies: { [cookieName: string]: string };
  }
}

export const createBuckets = (config: ConfigOptions): CookieAggregation => {
  const cookieAgg = new CookieAggregation();
  for (const i of config.buckets) {
    cookieAgg.addBucket(new Bucket(i));
  }
  return cookieAgg;
};

export const cookieAggregator = (
  fastify: FastifyInstance,
  options: ConfigOptions
) => {
  const aggregation = createBuckets(options);
  const aggregator = (
    request: FastifyRequest<{}>,
    response: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    let k: keyof typeof request.cookies;
    for (k in request.cookies) {
      aggregation.buckets[0].increment();
      fastify.log.info(
        `Number of cookies so far is ${k}  ${aggregation.buckets[0].getCount()}`
      );
    }

    done();
  };
  return aggregator;
};
