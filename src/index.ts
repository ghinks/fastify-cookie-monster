import fp, { PluginMetadata } from "fastify-plugin";
import validateInput, { schema, ConfigOptions } from "./inputSchema";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { cookieAggregator } from "./plugin";

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
  fastify.addHook("onRequest", cookieAggregator(fastify, options));
  done();
};

const options: PluginMetadata = {
  fastify: "3.x",
  name: "fastify-cookie-monster",
  dependencies: ["fastify-cookie"],
  decorators: {
    request: ["cookies"],
  },
};

module.exports = fp(myplugin, options);
