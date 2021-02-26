import tap from "tap";
import { createBuckets } from "./index";

tap.test("Cookie Aggregation", (t) => {
  t.test("Can Create Buckets", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    };
    const aggregation = createBuckets(config);
    t.equal(aggregation.buckets.length, config.buckets.length + 1);
    t.end();
  });
  t.test("Can add to a Bucket", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    };
    const aggregation = createBuckets(config);
    const smallestBucket = aggregation.buckets[0];
    t.equal(smallestBucket.addToBucket("cookie", 5), 1);
    t.end();
  });
  t.test("Can get properties", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    };
    const aggregation = createBuckets(config);
    t.equal(aggregation.buckets.length, config.buckets.length + 1);
    const smallestBucket = aggregation.buckets[0];
    t.equal(smallestBucket.addToBucket("cookie", 5), 1);
    t.equal(smallestBucket.getCount(), 1);
    t.equal(smallestBucket.getUpperBoundary(), 100);
    t.equal(smallestBucket.getLowerBoundary(), 0);
    t.true(smallestBucket.fitsBucket(1));
    t.equal(smallestBucket.getAverage(), 5);
    t.equal(smallestBucket.getLargestName(), "cookie");
    t.equal(smallestBucket.getLargest(), 5);
    t.end();
  });
  t.test("Extreme size gets put in end bucket", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    };
    const aggregation = createBuckets(config);
    t.equal(aggregation.buckets[3].addToBucket("cookie", 500000000), 1);
    t.end();
  });
  t.end();
});
