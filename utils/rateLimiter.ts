import { createClient } from "redis";
import { NextRequest, NextResponse } from "next/server";

//default redis
const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

//connection to redis
//redisClient.connect().catch(console.error);
redisClient
  .connect()
  .catch((error) => console.error("Redis Client Error", error));

//rate the limit
export async function rateLimit(request: NextRequest) {
  //get ip from x forward header
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  console.log("IP Address:", ip);

  if (!ip) {
    console.error("No IP address found");
    return new NextResponse(JSON.stringify({ message: "No IP addres found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rateLimitKey = `rate_limit:${ip}`;
  console.log("Rate Limit Key:", rateLimitKey);
  const current = await redisClient.incr(rateLimitKey);
  console.log("Current Request Count:", current);

  //first req
  if (current === 1) {
    await redisClient.expire(rateLimitKey, 5);
  } else if (current > 5) {
    console.error("Rate limit exceeded");
    return new NextResponse(
      JSON.stringify({ message: "You have exceded the limit of requests" }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
  //continue if no limit
  return NextResponse.next();
}
