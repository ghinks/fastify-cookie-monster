import fp from "fastify-plugin";
import validateInput, { schema, ConfigOptions } from "./inputSchema";
import myfunction from "./monitor";
import { FastifyInstance, FastifyPluginCallback } from "fastify";

const myplugin: FastifyPluginCallback<ConfigOptions> = (
  fastify: FastifyInstance,
  options: ConfigOptions,
  done
) => {
  if (!validateInput(options)) {
    throw new Error(
      `Invalid Options, valid options are ${JSON.stringify(
        schema.valueOf(),
        null,
        2
      )}`
    );
  }

  fastify.log.info(`Options ${JSON.stringify(options)}`);
  const config: ConfigOptions = options as ConfigOptions;
  fastify.decorate("util", myfunction);
  done();
};

module.exports = fp(myplugin);
