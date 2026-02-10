import { Request, Response } from "express";
import { householdService } from "./household.service.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import { catchAsync } from "../../shared/utils/catchAsync.js";

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
    const household = await householdService.createHousehold(
      req.body.name,
      user.userId,
    );
    const { inviteCodeHash, ...sanitized } =
      household as import("./household.repository.js").Household;
    res.status(201).json(sanitized);
  }),

  join: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const household = await householdService.joinHousehold(
      req.body.inviteCode,
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
