import { ConfigOptions } from "../inputSchema";
import { Bucket, createBuckets } from "../buckets";
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
export const cookieAggregator = (
  fastify: FastifyInstance,
  options: ConfigOptions
) => {
  const aggregation = createBuckets(options);
  const aggregator = (
    request: FastifyRequest,
    response: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    aggregation.dropInBucket(request);
    aggregation.buckets.forEach((b: Bucket) => {
      fastify.log.info(
        `Number of cookies so far is 
${b.getLowerBoundary()} <= x < ${b.getUpperBoundary()}  ${b.getCount()}        
average is ${b.getAverage()}
worst was ${b.getLargestName()} ${b.getLargest()}
`
      );
    });
    done();
  };
  return aggregator;
};
