import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { authService } from "./auth.service.js";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
} from "@recipe-planner/shared";
import { BadRequestError } from "../../shared/errors/index.js";
import { config } from "../../config/index.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import * as authUtils from "./auth.utils.js";
import { authRepository, UserRecord } from "./auth.repository.js";

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Validation failed", {
        errors: validation.error.format(),
      });
    }

    const result = await authService.register(validation.data);

    res.status(201).json({
      message: result.message,
      user: result.user,
    });
  }),

  verifyEmail: catchAsync(async (req: Request, res: Response) => {
    const validation = verifyEmailSchema.safeParse(req.query);
    if (!validation.success) {
      throw new BadRequestError("Invalid verification request", {
        errors: validation.error.format(),
      });
    }
    await authService.verifyEmail(validation.data.token);
    res.json({ message: "Email verified successfully" });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Validation failed", {
        errors: validation.error.format(),
      });
    }

    const result = await authService.login(validation.data);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  }),

  forgotPassword: catchAsync(async (req: Request, res: Response) => {
    const validation = forgotPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Invalid email address", {
        errors: validation.error.format(),
      });
    }
    await authService.forgotPassword(validation.data.email);
    res.json({
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  }),

  resetPassword: catchAsync(async (req: Request, res: Response) => {
    const validation = resetPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Validation failed", {
        errors: validation.error.format(),
      });
    }
    await authService.resetPassword(
      validation.data.token,
      validation.data.newPassword,
    );
    res.json({ message: "Password has been reset successfully" });
  }),

  changePassword: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Validation failed", {
        errors: validation.error.format(),
      });
    }
    const { currentPassword, newPassword } = validation.data;
    await authService.changePassword(user.userId, currentPassword, newPassword);
    res.json({ message: "Password changed successfully" });
  }),

  refresh: catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw new BadRequestError("Refresh token required");
    }

    const result = await authService.refresh(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  }),

  logout: catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.status(204).send();
  }),

  socialCallback: catchAsync(async (req: Request, res: Response) => {
    const user = (req as AuthRequest).user as unknown as UserRecord;
    if (!user) throw new BadRequestError("Social authentication failed");

    const accessToken = authUtils.generateAccessToken(user, user.tokenVersion);
    const refreshToken = authUtils.generateRefreshToken(
      user,
      user.tokenVersion,
    );

    const userRecord = await authRepository.findById(user.id);
    if (userRecord) {
      userRecord.refreshTokens.add(refreshToken);
      await authRepository.save(userRecord);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl = `${config.FRONTEND_SOCIAL_REDIRECT}?token=${accessToken}`;
    res.redirect(redirectUrl);
  }),
};
