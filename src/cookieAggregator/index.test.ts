import tap from "tap";
import { createBuckets } from "./index";

tap.test("Cookie Aggregation", (t) => {
  t.test("Can Create Buckets", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    };
    const aggregation = createBuckets(config);
    t.equal(aggregation.buckets.length, 3);
    const smallestBucket = aggregation.buckets[0];
    smallestBucket.increment();
    t.equal(smallestBucket.getCount(), 1);
    t.equal(smallestBucket.getBoundary(), 100);
    t.end();
  });
  t.end();
});
