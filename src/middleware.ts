import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// This will be reused for every request, preventing new connections.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Configure a generous rate limit to prevent brute-force attacks.
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // Allow 10 requests per 60 seconds from a single IP
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const config = {
  matcher: "/api/generate",
};

export default async function middleware(request: NextRequest) {
  // 1. Read the 'x-forwarded-for' header, which is the standard for identifying the original client IP.
  // 2. Fallback to a default for local development ('127.0.0.1').
  const identifier = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // Check if the user has exceeded their rate limit.
  const { success, limit, remaining, reset } = await ratelimit.limit(
    identifier
  );

  // If the limit is exceeded, return a 429 Too Many Requests response.
  if (!success) {
    return new NextResponse(
      "Too many requests. Please try again in a minute.",
      {
        status: 429,
        headers: {
          "X-Ratelimit-Limit": limit.toString(),
          "X-Ratelimit-Remaining": remaining.toString(),
          "X-Ratelimit-Reset": reset.toString(),
        },
      }
    );
  }

  // If the user is within their limit, allow the request to proceed.
  return NextResponse.next();
}
