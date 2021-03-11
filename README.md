# fastify cookie muncher

Keeping track of any egregious cookies that pass through your application is occasionally necessary. A means to simply
aggregate some statistics about the cookies being passed is provided by fastify cookie muncher.

interval Thursday 2nd March 2025 9:00:00 - Thursday 2nd March 2025 10:00:00, 1 hour

| bucket 1 | bucket 2 | bucket 3 | bucket 4 | bucket 5 |
| -------- | -------- | -------- | -------- | -------- |
| 0-9      | 10-19    | 20-49    | 50-99    | \>100    |
| 10       | 20       | 5        | 2        | 1        |

largest cookie length 1234

## Quick Start

```javascript
const fastify = require("fastify");
const fcm = require("@gvhinks/fastify-cookie-muncher").default;
fastify.register(fcm, {
  buckets: [10, 20, 50, 100],
});
```

This will decorate the fastify object with a _cookieAggregation_ object that provides services.

Currently only getBuckets is implemented. This will return an array.

```javascript
const buckets = fastify.cookieAggregation.getBuckets();
```

with each bucket containing an object

```typescript
export type BucketData = {
  upperBoundary: number;
  lowerBoundary: number;
  count: number;
  average: number;
  largest: number;
  largestName: string;
};
```

output

```json
({
  "lowerBoundary": 0,
  "upperBoundary": 10,
  "count": 0,
  "average": 0,
  "largest": 0,
  "largestName": ""
},
{
  "lowerBoundary": 10,
  "upperBoundary": 20,
  "count": 0,
  "average": 0,
  "largest": 0,
  "largestName": ""
},
{
  "lowerBoundary": 20,
  "upperBoundary": 50,
  "count": 1,
  "average": 24,
  "largest": 24,
  "largestName": "USER_TOKEN"
},
{
  "lowerBoundary": 50,
  "upperBoundary": 100,
  "count": 0,
  "average": 0,
  "largest": 0,
  "largestName": ""
},
{
  "lowerBoundary": 100,
  "upperBoundary": -1,
  "count": 0,
  "average": 0,
  "largest": 0,
  "largestName": ""
})
```

The buckets will be sequential. The catch all bucket will have an upper boundary of -1 to signify infinity.

## options

| option name | description                                         |
| ----------- | --------------------------------------------------- |
| the buckets | an array of buckets with the upper bounds specified |

The intent is to track the aggregation over the duration of the interval and log out the results.

## examples
