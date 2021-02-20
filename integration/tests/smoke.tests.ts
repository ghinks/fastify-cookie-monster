import tap from "tap";
import { request } from "undici";

tap.test(
  "Integration Test Basics",
  async (t): Promise<void> => {
    t.test(
      "Send a single cookie",
      async (t): Promise<void> => {
        const { statusCode, body } = await request("http://localhost:3000/");
        console.log("response received", statusCode);

        for await (const data of body) {
          console.log("data", data);
        }
        t.equal(statusCode, 200);
      }
    );
  }
);
