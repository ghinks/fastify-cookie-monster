import tap from "tap";
import { Bucket } from "./index";

tap.test("Buckets", (t) => {
  const lowerBoundary = 0;
  const upperBoundary = 100;
  t.test("Can Create and add to a Bucket", (t) => {
    const bucket = new Bucket(lowerBoundary, upperBoundary);
    bucket.addToBucket("mycookie", 10);
    t.equal(bucket.getData().count, 1);
    t.end();
  });

  t.test("Can Create check bucket range", (t) => {
    const bucket = new Bucket(lowerBoundary, upperBoundary);
    bucket.addToBucket("mycookie", 10);
    t.true(bucket.fitsBucket(99));
    t.false(bucket.fitsBucket(100));
    t.end();
  });

  t.test("Can replace largest cookie with a larger cookie", (t) => {
    const bucket = new Bucket(lowerBoundary, upperBoundary);
    bucket.addToBucket("mycookie", 10);
    bucket.addToBucket("myOtherCookie", 11);
    bucket.addToBucket("myOtherCookie", 10);
    t.equal(bucket.getData().largest, 11);
    t.end();
  });
  t.test("Can Create with max upper range", (t) => {
    const bucket = new Bucket(upperBoundary, Number.MAX_SAFE_INTEGER);
    t.true(bucket.fitsBucket(101));
    t.end();
  });
  t.test("Cannot Create with out of bounds range", (t) => {
    t.throws(function () {
      new Bucket(upperBoundary, Number.MAX_SAFE_INTEGER + 1);
    });
    t.end();
  });
  t.test("Can get Data", (t) => {
    const bucket = new Bucket(lowerBoundary, upperBoundary);
    bucket.addToBucket("mycookie", 10);
    t.same(bucket.getData(), {
      lowerBoundary: 0,
      upperBoundary: 100,
      count: 1,
      average: 10,
      largest: 10,
      largestName: "mycookie",
    });
    t.end();
  });
  // highly unlikely case, but test wrapping of the count works
  t.test("Max num boundary wrap", (t) => {
    const bucket = new Bucket(lowerBoundary, upperBoundary);
    bucket.getData().count = Number.MAX_SAFE_INTEGER;
    t.equal(bucket.getData().count, Number.MAX_SAFE_INTEGER);
    bucket.addToBucket("mycookie", 10);
    t.equal(bucket.getData().count, 1);
    t.end();
  });
  t.end();
});
