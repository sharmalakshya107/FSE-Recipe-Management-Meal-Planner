import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { mealPlanService } from "./mealPlan.service.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";

export const mealPlanController = {
  getPlan: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const { startDate, endDate } = req.query as {
      startDate: string;
      endDate: string;
    };

    const plan = await mealPlanService.getWeeklyPlan(
      user.userId,
      startDate,
      endDate,
    );
    res.json(plan);
  }),

  updatePlan: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const plan = await mealPlanService.updatePlan(
      req.params["id"]!,
      req.body,
      user.userId,
    );
    res.json(plan);
  }),
};
