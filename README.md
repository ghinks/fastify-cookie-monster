# fastify cookie monster

Keeping track of all the cookies that pass through your application is a routine activity. This may need to take place
in order to record the size of cookies or the number of them. A means to simply log some statistics about the cookies
being passed is provided by fastify cookie monster.

## options

| option name | description |
|----------|----------|
| interval | The duration over which statistics are gathered |
| the buckets | the aggregation buckets defaults are 0-100, 101-500,501-1000,1001-2000, >2001|

The intent is to track the aggregation over the duration of the interval and log out the results.
