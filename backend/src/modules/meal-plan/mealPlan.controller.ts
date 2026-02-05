import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { mealPlanService } from "./mealPlan.service.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import {
  dateRangeQuerySchema,
  updateMealPlanSchema,
  UpdateMealPlanInput,
} from "@recipe-planner/shared";
import { BadRequestError } from "../../shared/errors/index.js";

export const mealPlanController = {
  getPlan: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = dateRangeQuerySchema.safeParse(req.query);
    if (!validation.success) {
      throw new BadRequestError("Invalid date range", {
        errors: validation.error.format(),
      });
    }
    const { startDate, endDate } = validation.data;

    if (!startDate || !endDate)
      throw new BadRequestError("StartDate and EndDate are required");

    const plan = await mealPlanService.getWeeklyPlan(
      user.userId,
      startDate,
      endDate,
    );
    res.json(plan);
  }),

  updatePlan: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = updateMealPlanSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Invalid update data", {
        errors: validation.error.format(),
      });
    }

    const plan = await mealPlanService.updatePlan(
      req.params["id"]!,
      validation.data as UpdateMealPlanInput,
      user.userId,
    );
    res.json(plan);
  }),
};
