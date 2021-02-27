import tap from "tap"
import myfunction from "./index"

tap.test("Describe block", (t) => {
  t.plan(1)
  t.test("basics", (t) => {
    t.equal(myfunction("abc"), "abc")
    t.end()
  })
})
