import { Request, Response } from "express";
import { householdService } from "./household.service.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import { BadRequestError } from "../../shared/errors/index.js";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import {
  createHouseholdSchema,
  joinHouseholdSchema,
} from "@recipe-planner/shared";

export const householdController = {
  getHousehold: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const household = await householdService.getHousehold(user.userId);
    const { inviteCodeHash, ...sanitized } =
      household as import("./household.repository.js").Household;
    res.json(sanitized);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = createHouseholdSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Invalid household data", {
        errors: validation.error.format(),
      });
    }
    const household = await householdService.createHousehold(
      validation.data.name,
      user.userId,
    );
    const { inviteCodeHash, ...sanitized } =
      household as import("./household.repository.js").Household;
    res.status(201).json(sanitized);
  }),

  join: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = joinHouseholdSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Invalid invite code", {
        errors: validation.error.format(),
      });
    }
    const household = await householdService.joinHousehold(
      validation.data.inviteCode,
      user.userId,
    );
    const { inviteCodeHash, ...sanitized } =
      household as import("./household.repository.js").Household;
    res.json(sanitized);
  }),

  leave: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    await householdService.leaveHousehold(user.userId);
    res.status(204).end();
  }),
};
