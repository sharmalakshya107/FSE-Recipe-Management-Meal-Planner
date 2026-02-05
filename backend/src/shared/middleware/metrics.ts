import { Request, Response, NextFunction } from "express";

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    console.log(
      `[METRICS] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
    );
  });

  next();
};
