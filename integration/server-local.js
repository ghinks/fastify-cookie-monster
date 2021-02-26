const fastify = require("fastify")({
  logger: true,
});
fastify.register(require("fastify-cookie")).register(require("../dist/index"), {
  interval: 3600,
  buckets: [10, 20, 50, 100],
});

// Declare a route
fastify.get("/", function (request, reply) {
  fastify.log.error(fastify.util("============================="));
  reply.send({ hello: "world" });
});

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
