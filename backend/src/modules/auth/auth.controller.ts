import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { authService } from "./auth.service.js";
import { BadRequestError } from "../../shared/errors/index.js";
import { config } from "../../config/index.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import * as authUtils from "./auth.utils.js";
import { authRepository, UserRecord } from "./auth.repository.js";

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    res.status(201).json({
      message: result.message,
      user: result.user,
    });
  }),

  verifyEmail: catchAsync(async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };
    await authService.verifyEmail(token);
    res.json({ message: "Email verified successfully" });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

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
    await authService.forgotPassword(req.body.email);
    res.json({
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  }),

  resetPassword: catchAsync(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.json({ message: "Password has been reset successfully" });
  }),

  changePassword: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const { currentPassword, newPassword } = req.body;
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
