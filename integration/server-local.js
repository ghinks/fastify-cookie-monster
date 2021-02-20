const cookieMonsterPlugin = require("../dist/index");
const fastify = require("fastify")({
  logger: true,
});

const cmConf = {
  interval: 3600,
  buckets: [100, 250, 500, 1000],
};
fastify.register(cookieMonsterPlugin, cmConf);

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
