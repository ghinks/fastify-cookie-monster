import tap from "tap";
import { createBucketAggregation } from "./index";
import { FastifyRequest } from "fastify";

tap.test("Cookie Aggregation", (t) => {
  t.test("Cannot Create Bucket List with out of range values", (t) => {
    const config = {
      buckets: [Number.MAX_SAFE_INTEGER + 1],
    };
    t.throws(function () {
      createBucketAggregation(config);
    });
    t.end();
  });
  t.test("Can Create Buckets", (t) => {
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    t.equal(aggregation.buckets.length, config.buckets.length + 1);
    t.end();
  });
  t.test("Can add to a Bucket", (t) => {
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    const smallestBucket = aggregation.buckets[0];
    t.equal(smallestBucket.addToBucket("cookie", 5), 1);
    t.end();
  });
  t.test("Can get properties", (t) => {
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    t.equal(aggregation.buckets.length, config.buckets.length + 1);
    const smallestBucket = aggregation.buckets[0];
    t.equal(smallestBucket.addToBucket("cookie", 5), 1);
    t.equal(smallestBucket.getData().count, 1);
    t.equal(smallestBucket.getData().upperBoundary, 100);
    t.equal(smallestBucket.getData().lowerBoundary, 0);
    t.true(smallestBucket.fitsBucket(1));
    t.equal(smallestBucket.getData().average, 5);
    t.equal(smallestBucket.getData().largestName, "cookie");
    t.equal(smallestBucket.getData().largest, 5);
    t.equal(aggregation.getBuckets().length, 4);
    t.end();
  });
  t.test("Extreme size gets put in end bucket", (t) => {
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    t.equal(aggregation.buckets[3].addToBucket("cookie", 500000000), 1);
    t.end();
  });
  t.test("largest in bucket gets updated", (t) => {
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    t.equal(aggregation.buckets[0].addToBucket("cookie1", 5), 1);
    t.equal(aggregation.buckets[0].addToBucket("cookie2", 1), 2);
    t.equal(aggregation.buckets[0].getData().largest, 5);
    t.equal(aggregation.buckets[0].getData().largestName, "cookie1");
    t.end();
  });
  t.test("average gets updated", (t) => {
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    t.equal(aggregation.buckets[0].addToBucket("cookie1", 5), 1);
    t.equal(aggregation.buckets[0].addToBucket("cookie2", 3), 2);
    t.equal(aggregation.buckets[0].addToBucket("cookie3", 1), 3);
    t.equal(aggregation.buckets[0].addToBucket("cookie4", 1), 4);
    t.equal(aggregation.buckets[0].addToBucket("cookie5", 1), 5);
    t.equal(aggregation.buckets[0].addToBucket("cookie5", 1), 6);
    t.equal(aggregation.buckets[0].getData().average, 2);
    t.end();
  });
  t.test("test drop in bucket", (t) => {
    const requestWithCookies = {
      cookies: {
        "cookie-name": "cookie-value",
      },
    };
    const config = {
      buckets: [100, 200, 1000],
    };
    const aggregation = createBucketAggregation(config);
    aggregation.dropInBucket((requestWithCookies as unknown) as FastifyRequest);
    t.end();
  });
  t.end();
});
