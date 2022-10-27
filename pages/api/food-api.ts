import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import supabase from "@/utils/supabase";

const ALL_USERS_LIMIT_PER_DAY = {
  limit: 100000,
  time: 1,
};
const USERS_LIMIT_PER_DAY = {
  limit: 10000,
  time: 1,
};
const USERS_LIMIT_PER_MINUTE = {
  limit: 1000,
  time: 1,
};

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// API calls my only be done by registered users.
const checkId = async (id: string) => {
  const { data: user } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .single();
  return !!user;
};

// API calls should have set limits per day (applies to all users). (100k requests).
const allUsersPerDay = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(
    ALL_USERS_LIMIT_PER_DAY.limit,
    `${ALL_USERS_LIMIT_PER_DAY.time} d`
  ),
});

// API calls should have set limits per account (rule applies to a single user). (10k requests)
const accountPerDay = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(
    USERS_LIMIT_PER_DAY.limit,
    `${USERS_LIMIT_PER_DAY.time} d`
  ),
});

// API calls should have a timeout (I cannot make 1000 requests in 1 minute.)
const requestTimeout = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(
    USERS_LIMIT_PER_MINUTE.limit,
    `${USERS_LIMIT_PER_MINUTE.time} m`
  ),
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!checkId(id)) {
        return res.status(500).json({
          message: "Unauthorized User",
        });
      }

      const allUsersPerDayResult = await allUsersPerDay.limit("all_users");
      if (!allUsersPerDayResult.success) {
        return res.status(500).json({
          message: `The request has been rate limited. Only ${ALL_USERS_LIMIT_PER_DAY} requests per day for all users are available`,
          rateLimitState: allUsersPerDayResult,
        });
      }

      const accountPerDayResult = await accountPerDay.limit(id);
      if (!accountPerDayResult.success) {
        return res.status(500).json({
          message: `The request has been rate limited. Only ${USERS_LIMIT_PER_DAY} requests per day for specific account are available`,
          rateLimitState: accountPerDayResult,
        });
      }

      const requestTimeoutResult = await requestTimeout.limit(id);
      if (!requestTimeoutResult.success) {
        return res.status(500).json({
          message: `The request has been rate limited. Only ${USERS_LIMIT_PER_MINUTE} requests per minute for specific account are available`,
          rateLimitState: requestTimeoutResult,
        });
      }

      const { data: foods } = await supabase.from("food").select("*");

      console.log(
        allUsersPerDayResult,
        accountPerDayResult,
        requestTimeoutResult
      );

      res.status(200).json({
        foods,
        allUsersRemaining: allUsersPerDayResult.remaining,
        accountPerDayRemaining: accountPerDayResult.remaining,
        requestTimeoutReamining: requestTimeoutResult.remaining,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}
