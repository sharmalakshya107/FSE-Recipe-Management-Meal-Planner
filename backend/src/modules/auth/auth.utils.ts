import jwt from "jsonwebtoken";
import { User } from "@recipe-planner/shared";
import { config } from "../../config/index.js";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  version: number;
}

export const generateAccessToken = (user: User, version: number): string => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    version,
  };
  return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRE,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (user: User, version: number): string => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    version,
  };
  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRE,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET) as TokenPayload;
};
