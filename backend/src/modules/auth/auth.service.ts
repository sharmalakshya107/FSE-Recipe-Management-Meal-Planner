import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
} from "@recipe-planner/shared";
import { authRepository, UserRecord } from "./auth.repository.js";
import * as authUtils from "./auth.utils.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from "../../shared/errors/index.js";
import { emailService } from "./email.service.js";
import { householdRepository } from "../household/household.repository.js";

const populateUserWithHousehold = async (user: UserRecord) => {
  const { passwordHash, refreshTokens, tokenVersion, ...profile } = user;

  try {
    const { householdService } =
      await import("../household/household.service.js");
    const hData = await householdService.getHousehold(user.id);

    const members = await authRepository.findByIds(hData.memberIds);
    const mappedMembers = members.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      role: (m.role as string).toLowerCase() as "user" | "admin",
    }));

    let inviteCode = hData.inviteCode;
    if (!inviteCode) {
      inviteCode = crypto.randomBytes(5).toString("hex").toUpperCase();
      const hash = crypto.createHash("sha256").update(inviteCode).digest("hex");
      hData.inviteCode = inviteCode;
      hData.inviteCodeHash = hash;
      await householdRepository.save(hData);
    }

    const householdData = {
      id: hData.id,
      name: hData.name,
      inviteCode,
      ownerId: hData.adminId,
      members: mappedMembers,
    };

    return { ...profile, household: householdData };
  } catch (e) {
    return {
      ...profile,
      role: (profile.role as string).toLowerCase() as "user" | "admin",
    };
  }
};

export const authService = {
  register: async (
    input: RegisterInput,
  ): Promise<{ user: AuthResponse["user"]; message: string }> => {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new BadRequestError("Email already registered");
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser: UserRecord = {
      id: uuidv4(),
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: "user",
      createdAt: new Date().toISOString(),
      passwordHash,
      tokenVersion: 0,
      refreshTokens: new Set(),
      failedLoginAttempts: 0,
      emailVerified: false,
      verificationToken,
    };

    const savedUser = await authRepository.save(newUser);
    await emailService.sendVerificationEmail(
      savedUser.email,
      verificationToken,
    );

    const populatedUser = await populateUserWithHousehold(savedUser);

    return {
      user: populatedUser,
      message: "Please check your email to verify your account.",
    };
  },

  verifyEmail: async (token: string): Promise<void> => {
    const user = await authRepository.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    user.emailVerified = true;
    user.verificationToken = null;
    await authRepository.save(user);
  },

  login: async (input: LoginInput): Promise<AuthResponse> => {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedError("Account is temporarily locked");
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.emailVerified) {
      throw new ForbiddenError("Please verify your email first");
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    const accessToken = authUtils.generateAccessToken(user, user.tokenVersion);
    const refreshToken = authUtils.generateRefreshToken(
      user,
      user.tokenVersion,
    );

    if (user.refreshTokens.size >= 5) {
      const tokens = Array.from(user.refreshTokens);
      user.refreshTokens = new Set(tokens.slice(tokens.length - 4));
    }
    user.refreshTokens.add(refreshToken);
    await authRepository.save(user);

    const populatedUser = await populateUserWithHousehold(user);

    return {
      accessToken,
      refreshToken,
      user: populatedUser,
    };
  },

  forgotPassword: async (email: string): Promise<void> => {
    const user = await authRepository.findByEmail(email);
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000);

    await authRepository.save(user);
    await emailService.sendPasswordResetEmail(user.email, resetToken);
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const user = await authRepository.findByResetToken(token);
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestError("Invalid or expired reset token");
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.tokenVersion += 1;
    user.refreshTokens.clear();

    await authRepository.save(user);
  },

  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    const user = await authRepository.findById(userId);
    if (!user) throw new UnauthorizedError("User not found");

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.tokenVersion += 1;
    user.refreshTokens.clear();

    await authRepository.save(user);
  },

  refresh: async (token: string): Promise<AuthResponse> => {
    try {
      const payload = authUtils.verifyRefreshToken(token);
      const user = await authRepository.findById(payload.userId);

      if (
        !user ||
        !user.refreshTokens.has(token) ||
        user.tokenVersion !== payload.version
      ) {
        if (user) {
          user.refreshTokens.clear();
          user.tokenVersion += 1;
          await authRepository.save(user);
        }
        throw new UnauthorizedError("Invalid refresh token");
      }

      user.refreshTokens.delete(token);
      const accessToken = authUtils.generateAccessToken(
        user,
        user.tokenVersion,
      );
      const refreshToken = authUtils.generateRefreshToken(
        user,
        user.tokenVersion,
      );

      user.refreshTokens.add(refreshToken);
      await authRepository.save(user);

      const populatedUser = await populateUserWithHousehold(user);

      return {
        accessToken,
        refreshToken,
        user: populatedUser,
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  },

  logout: async (userId: string, token: string): Promise<void> => {
    const user = await authRepository.findById(userId);
    if (user) {
      user.refreshTokens.delete(token);
      await authRepository.save(user);
    }
  },
};
