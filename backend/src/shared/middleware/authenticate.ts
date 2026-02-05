import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../../modules/auth/auth.utils.js";
import { authRepository } from "../../modules/auth/auth.repository.js";
import { UnauthorizedError } from "../errors/index.js";

export interface AuthRequest extends Request {
  user: TokenPayload;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Token not found");
    }

    const payload = verifyAccessToken(token);
    const user = await authRepository.findById(payload.userId);

    if (!user || user.tokenVersion !== payload.version) {
      throw new UnauthorizedError("Token is no longer valid");
    }

    (req as AuthRequest).user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
