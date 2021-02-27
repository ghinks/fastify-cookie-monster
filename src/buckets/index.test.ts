import tap from "tap"
import { createBuckets } from "./index"
import { FastifyRequest } from "fastify"

tap.test("Cookie Aggregation", (t) => {
  t.test("Can Create Buckets", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    t.equal(aggregation.buckets.length, config.buckets.length + 1)
    t.end()
  })
  t.test("Can add to a Bucket", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    const smallestBucket = aggregation.buckets[0]
    t.equal(smallestBucket.addToBucket("cookie", 5), 1)
    t.end()
  })
  t.test("Can get properties", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    t.equal(aggregation.buckets.length, config.buckets.length + 1)
    const smallestBucket = aggregation.buckets[0]
    t.equal(smallestBucket.addToBucket("cookie", 5), 1)
    t.equal(smallestBucket.getCount(), 1)
    t.equal(smallestBucket.getUpperBoundary(), 100)
    t.equal(smallestBucket.getLowerBoundary(), 0)
    t.true(smallestBucket.fitsBucket(1))
    t.equal(smallestBucket.getAverage(), 5)
    t.equal(smallestBucket.getLargestName(), "cookie")
    t.equal(smallestBucket.getLargest(), 5)
    t.end()
  })
  t.test("Extreme size gets put in end bucket", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    t.equal(aggregation.buckets[3].addToBucket("cookie", 500000000), 1)
    t.end()
  })
  t.test("largest in bucket gets updated", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    t.equal(aggregation.buckets[0].addToBucket("cookie1", 5), 1)
    t.equal(aggregation.buckets[0].addToBucket("cookie2", 1), 2)
    t.equal(aggregation.buckets[0].getLargest(), 5)
    t.equal(aggregation.buckets[0].getLargestName(), "cookie1")
    t.end()
  })
  t.test("average gets updated", (t) => {
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    t.equal(aggregation.buckets[0].addToBucket("cookie1", 5), 1)
    t.equal(aggregation.buckets[0].addToBucket("cookie2", 3), 2)
    t.equal(aggregation.buckets[0].addToBucket("cookie3", 1), 3)
    t.equal(aggregation.buckets[0].addToBucket("cookie4", 1), 4)
    t.equal(aggregation.buckets[0].addToBucket("cookie5", 1), 5)
    t.equal(aggregation.buckets[0].addToBucket("cookie5", 1), 6)
    t.equal(aggregation.buckets[0].getAverage(), 2)
    t.end()
  })
  t.test("test drop in bucket", (t) => {
    const requestWithCookies = {
      cookies: {
        "cookie-name": "cookie-value",
      },
    }
    const config = {
      interval: 10000,
      buckets: [100, 200, 1000],
    }
    const aggregation = createBuckets(config)
    aggregation.dropInBucket((requestWithCookies as unknown) as FastifyRequest)
    t.end()
  })
  t.end()
})
