const table = require("table").table;
const fastify = require("fastify")({
  logger: true,
});
fastify.register(require("fastify-cookie")).register(require("../dist/index"), {
  buckets: [10, 20, 50, 100, 1000],
});

// Declare a route
fastify.get("/", function (request, reply) {
  const buckets = fastify.cookieAggregation.getBuckets();
  reply.send(buckets);
});

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
  /*
  setInterval(() => {
    const buckets = fastify.cookieAggregation.getBuckets();
    const tabulated = buckets.reduce( (a, c) => {
      const formated = [c.lowerBoundary, c.upperBoundary, c.average, c.largest];
      return [...a, formated]
    }, [["lower", "upper", "avg", "largest"]])
    const output = table(tabulated, {

    });
    console.log(output)
  }, 5000);
   */
});
