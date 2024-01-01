// import { NextResponse, NextRequest } from "next/server";
// import { rateLimit } from "@/utils/rateLimiter";
// import jwt from "jsonwebtoken";

// function isTokenValid(token: string) {
//   if (!token) return false;
//   try {
//     jwt.verify(token, process.env.JWT_SECRET as string);
//     return true;
//   } catch (error) {
//     console.error("Token validation error", error);
//     return false;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const path = new URL(request.url).pathname;

//   // Include the path you want the middleware to handle
//   const pathsToHandle = ["/api/login"];

//   // Check if the current path is not in the list of paths to handle
//   if (!pathsToHandle.includes(path)) {
//     // Skip middleware for paths not in the list
//     return NextResponse.next();
//   }

//   console.log("Middleware hit");
//   const rateLimitRes = await rateLimit(request);
//   if (rateLimitRes instanceof NextResponse) {
//     return rateLimitRes;
//   }
//   const response = NextResponse.next();

//   response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   response.headers.set(
//     "Access-Control-Allow-Methods",
//     "GET, POST,PUT,DELETE,OPTIONS"
//   );
//   response.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type,Authorization"
//   );

//   if (request.method === "OPTIONS") {
//     //return response;
//     return new NextResponse(null, { status: 204 });
//   }

//   const token = request.headers.get("authorization")?.split(" ")[1];

//   if (!token || !isTokenValid(token)) {
//     return new NextResponse("Not Authorized", { status: 401 });
//   }
//   return response;
// }

import RateLimit from "@/utils/models/RateLimit";
import { NextRequest, NextResponse } from "next/server";

const MAX_REQUESTS = 3; // Max requests per IP per day
const RATE_LIMIT_WINDOW = 5 * 1000; // 24 hours in milliseconds

export async function middleware(req: NextRequest) {
  console.log("Middleware triggered");
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  let rateLimitRecord = await RateLimit.findOne({ ip });

  if (!rateLimitRecord) {
    rateLimitRecord = new RateLimit({ ip, count: 1, lastRequest: new Date() });
    await rateLimitRecord.save();
    return NextResponse.next();
  }

  const currentTime = new Date().getTime();
  const lastRequestTime = new Date(rateLimitRecord.lastRequest).getTime();
  const timeDiff = currentTime - lastRequestTime;

  if (timeDiff > RATE_LIMIT_WINDOW) {
    rateLimitRecord.count = 1;
    rateLimitRecord.lastRequest = new Date();
  } else {
    rateLimitRecord.count += 1;
  }

  await rateLimitRecord.save();

  if (rateLimitRecord.count > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({ message: "Rate limit exceeded" }),
      { status: 429 }
    );
  }
  return NextResponse.next();
}
