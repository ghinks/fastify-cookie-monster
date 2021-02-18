import tap from "tap";
import myfunction from "./index";

tap.test("basics", (t) => {
  t.equal(myfunction("abc"), "abc");
  t.end();
});
