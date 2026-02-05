import mongoose, { Schema } from "mongoose";
import { UserRecord } from "./auth.repository.js";

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    passwordHash: { type: String },
    tokenVersion: { type: Number, default: 0 },
    refreshTokens: { type: [String], default: [] },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    googleId: { type: String, index: true },
    githubId: { type: String, index: true },
  },
  {
    timestamps: true,
    _id: false,
  },
);

userSchema.virtual("id").get(function (this: mongoose.Document & UserRecord) {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.passwordHash;
    delete ret.refreshTokens;
  },
});

export const UserModel = mongoose.model<UserRecord>("User", userSchema);
