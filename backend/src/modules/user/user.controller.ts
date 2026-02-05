import { Request, Response } from "express";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import { userService } from "./user.service.js";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { updateUserProfileSchema } from "@recipe-planner/shared";
import { BadRequestError } from "../../shared/errors/index.js";

export const userController = {
  getProfile: catchAsync(async (req: Request, res: Response) => {
    const {
      user: { userId },
    } = req as AuthRequest;
    const profile = await userService.getProfile(userId);
    res.json(profile);
  }),

  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const {
      user: { userId },
    } = req as AuthRequest;
    const validation = updateUserProfileSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Invalid profile data", {
        errors: validation.error.format(),
      });
    }
    const profile = await userService.updateProfile(userId, validation.data);
    res.json(profile);
  }),
};
