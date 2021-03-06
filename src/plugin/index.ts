import { ConfigOptions } from "../inputSchema";
import { createBucketAggregation } from "../buckets";
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
type myaggregator = (
  request: FastifyRequest,
  response: FastifyReply,
  done: HookHandlerDoneFunction
) => void;

export const cookieAggregator = (
  fastify: FastifyInstance,
  options: ConfigOptions
): myaggregator => {
  const aggregation = createBucketAggregation(options);
  fastify.decorate("cookieAggregation", aggregation);
  const aggregator = (
    request: FastifyRequest,
    response: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    aggregation.dropInBucket(request);
    done();
  };
  return aggregator;
};
