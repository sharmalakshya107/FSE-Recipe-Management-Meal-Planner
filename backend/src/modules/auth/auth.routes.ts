import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import passport from "passport";
import { authLimiter } from "../../shared/middleware/rateLimit.js";
import { validate } from "../../shared/middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "@recipe-planner/shared";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  authController.register,
);
router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get(
  "/verify-email",
  validate({ query: verifyEmailSchema }),
  authController.verifyEmail,
);
router.post(
  "/forgot-password",
  authLimiter,
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authLimiter,
  validate({ body: resetPasswordSchema }),
  authController.resetPassword,
);

router.post(
  "/change-password",
  authenticate,
  validate({ body: changePasswordSchema }),
  authController.changePassword,
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.socialCallback,
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.socialCallback,
);

export default router;
