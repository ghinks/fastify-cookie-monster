import tap from "tap";
import { Client } from "undici";

tap.test(
  "Integration Test Basics",
  async (t): Promise<void> => {
    const client = new Client("http://localhost:3000");
    t.test(
      "Send a single cookie",
      async (t): Promise<void> => {
        const opts = {
          method: "GET",
          path: "/",
          headers: {
            cookie: "name=value",
          },
        };
        const { statusCode, body } = await client.request(opts);
        t.equal(statusCode, 200);
        body.setEncoding("utf8");
        let data = "";
        for await (const chunk of body) {
          data += chunk;
        }
        const result = JSON.parse(data);
        t.equal(result.length, 6);
        const smallestBucket = result[0];
        t.deepEqual(smallestBucket, {
          upperBoundary: 10,
          lowerBoundary: 0,
          count: 1,
          average: 5,
          largest: 5,
          largestName: "name",
        });
      }
    );
  }
);
