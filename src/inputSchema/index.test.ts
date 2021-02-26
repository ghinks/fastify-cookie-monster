import tap from "tap";
import verify from "./index";
import { ConfigOptions } from "./index";

tap.test("Validate Inputs Against Schema", (t) => {
  const validOptions = {
    interval: 100,
    buckets: [100, 200, 300],
  };
  t.true(verify(validOptions));
  const invalidOptions = {
    buckets: [100, 200, 300],
  };
  t.false(verify(<ConfigOptions>invalidOptions));
  t.end();
});
