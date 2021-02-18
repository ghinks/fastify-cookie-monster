const myplugin = require("../dist/index");
const fastify = require("fastify")({
  logger: true,
});

fastify.register(myplugin);

// Declare a route
fastify.get("/", function (request, reply) {
  fastify.log.info(fastify.util("============================="));
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
