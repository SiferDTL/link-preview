
import rateLimit from "express-rate-limit"
import { Request, Response, NextFunction } from 'express';

export const limiter = (duration: number, limit: number) => {
  return rateLimit({
    windowMs: duration, // 15 minutes
    max: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (_req: Request, res: Response, _next: NextFunction) => {
      res.status(429).json({
        status: "error",
        code: 429,
        message: "Too many requests, please try later",
      });
    },
  });
};
