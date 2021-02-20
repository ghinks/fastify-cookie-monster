import S from "fluent-json-schema";
import Ajv from "ajv";

interface ConfigOptions {
  interval: number;
  buckets: number[];
}

const schema = S.object()
  .id("fastify-cookie-monster")
  .prop("interval", S.number().required())
  .prop("buckets", S.array().minItems(0).items(S.number()).required())
  .valueOf();

// eslint-disable-next-line @typescript-eslint/ban-types
const validateInput = (input: object): boolean => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema.valueOf());
  return validate(input);
};

export { validateInput as default, schema, ConfigOptions };
