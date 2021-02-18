import fp from "fastify-plugin";
import myfunction from "./monitor";
import { FastifyInstance, FastifyPluginCallback } from "fastify";

export interface MyOpts {
  myPluginOption: string;
}

const myplugin: FastifyPluginCallback<MyOpts> = (
  fastify: FastifyInstance,
  options: MyOpts,
  done
) => {
  fastify.decorate("util", myfunction);
  done();
};

module.exports = fp(myplugin);
