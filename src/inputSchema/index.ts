import S from "fluent-json-schema";
import Ajv from "ajv";

export interface ConfigOptions {
  //  interval: number;
  buckets: number[];
}

const schema = S.object()
  .id("fastify-cookie-monster")
  //  .prop("interval", S.number().required())
  .prop("buckets", S.array().minItems(0).items(S.number()).required())
  .valueOf();

const validateInput = (input: ConfigOptions): boolean => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema.valueOf());
  return validate(input);
};

export { validateInput as default, schema };
