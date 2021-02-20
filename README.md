# fastify cookie monster

Keeping track of all the cookies that pass through your application is a routine activity. This may need to take place
in order to record the size of cookies or the number of them. A means to simply log some statistics about the cookies
being passed is provided by fastify cookie monster.

interval Thursday 2nd March 2025 9:00:00 - Thursday 2nd March 2025 10:00:00, 1 hour

| bucket 1 | bucket 2 | bucket 3 | bucket 4 | bucket 5  | bucket 6 |
| -------- | -------- | -------- | -------- | --------- | -------- |
| 0-99     | 100-199  | 200-499  | 500-999  | 1000-1499 | \>1500   |
| 10       | 20       | 5        | 2        | 1         | 0        |

largest cookie length 1234

## Quick Start

```javascript
const fastify = require("fastify");
const fcm = require("@gvhinks/fastify-cookie-monster").default;
fastify.register(fcm, {
  interval: 3600, // seconds in an hour
  buckets: [100, 200, 500, 1000, 1500],
});
```

This will log out the aggregate cookie sizes over every hour in buckets

| bucket 1 | bucket 2 | bucket 3 | bucket 4 | bucket 5  | bucket 6 |
| -------- | -------- | -------- | -------- | --------- | -------- |
| 0-99     | 100-199  | 200-499  | 500-999  | 1000-1499 | \>1500   |

## options

| option name | description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| interval    | The duration over which statistics are gathered                               |
| the buckets | the aggregation buckets defaults are 0-100, 101-500,501-1000,1001-2000, >2001 |

The intent is to track the aggregation over the duration of the interval and log out the results.

## examples
