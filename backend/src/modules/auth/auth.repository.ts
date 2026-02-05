import { User } from "@recipe-planner/shared";
import { UserModel } from "./user.model.js";
import { ClientSession } from "mongoose";

export interface UserRecord extends Omit<User, "role"> {
  role: "user" | "admin";
  passwordHash: string;
  tokenVersion: number;
  refreshTokens: Set<string>;
  lockedUntil?: Date | null;
  failedLoginAttempts: number;

  emailVerified: boolean;
  verificationToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  googleId?: string;
  githubId?: string;
}

export const authRepository = {
  findByEmail: async (email: string): Promise<UserRecord | undefined> => {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) return undefined;
    return mapDocToUserRecord(user);
  },

  findById: async (id: string): Promise<UserRecord | undefined> => {
    const user = await UserModel.findOne({ _id: id }).lean();
    if (!user) return undefined;
    return mapDocToUserRecord(user);
  },

  findByIds: async (ids: string[]): Promise<UserRecord[]> => {
    const users = await UserModel.find({ _id: { $in: ids } }).lean();
    return users.map(mapDocToUserRecord);
  },

  findByVerificationToken: async (
    token: string,
  ): Promise<UserRecord | undefined> => {
    const user = await UserModel.findOne({ verificationToken: token }).lean();
    if (!user) return undefined;
    return mapDocToUserRecord(user);
  },

  findByResetToken: async (token: string): Promise<UserRecord | undefined> => {
    const user = await UserModel.findOne({ passwordResetToken: token }).lean();
    if (!user) return undefined;
    return mapDocToUserRecord(user);
  },

  save: async (
    user: UserRecord,
    session?: ClientSession,
  ): Promise<UserRecord> => {
    const exists = await UserModel.exists({ _id: user.id }).session(
      session || null,
    );

    const docToSave = {
      ...user,
      _id: user.id,
      refreshTokens: Array.from(user.refreshTokens),
    };

    if (exists) {
      await UserModel.updateOne({ _id: user.id }, docToSave, { session });
    } else {
      await UserModel.create([docToSave], { session });
    }

    return user;
  },
};

const mapDocToUserRecord = (doc: unknown): UserRecord => {
  const d = doc as Record<string, unknown>;
  return {
    ...(d as unknown as UserRecord),
    id: d._id as string,
    refreshTokens: new Set(d.refreshTokens as string[]),
    createdAt:
      d.createdAt instanceof Date
        ? d.createdAt.toISOString()
        : (d.createdAt as string),
  };
};
