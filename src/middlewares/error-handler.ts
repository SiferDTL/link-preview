import { Request, Response, NextFunction } from 'express';

export class CustomError extends Error {
  statusCode: number;
  status: string;

  constructor(statusCode: number, message: string, name = "AppError") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "error" : "fail";
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const wrapperError = <T extends Function>(fn: T) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fn(req, res, next);
    return result;
  } catch (error: any) {
    switch (error.name) {
      case "ValidationError":
        res.status(400).json({
          status: "error",
          code: 400,
          message: error.message,
        });
        break;
      case "AppError":
        const appError = error as CustomError;
        res.status(appError.statusCode).json({
          status: appError.status,
          code: appError.statusCode,
          message: appError.message,
        });
        break;
      default:
        next(error);
        break;
    }
  }
};