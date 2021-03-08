const fastify = require("fastify")({
  logger: true,
});
fastify.register(require("fastify-cookie")).register(require("../dist/index"), {
  interval: 3600,
  buckets: [10, 20, 50, 100],
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
  setInterval(() => {
    fastify.cookieAggregation.getBuckets().forEach((b) => fastify.log.info(b));
  }, 5000);
});
