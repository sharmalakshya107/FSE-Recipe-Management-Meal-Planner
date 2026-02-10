import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodSchema, ZodError } from "zod";
import { BadRequestError } from "../errors/index.js";

export const validate = (schema: {
  body?: AnyZodObject | ZodSchema;
  query?: AnyZodObject | ZodSchema;
  params?: AnyZodObject | ZodSchema;
}) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(
          req.query,
        )) as unknown as Request["query"];
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(
          req.params,
        )) as unknown as Request["params"];
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new BadRequestError("Validation failed", {
            errors: error.format(),
          }),
        );
      } else {
        next(error);
      }
    }
  };
};
