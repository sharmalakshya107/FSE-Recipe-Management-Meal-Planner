import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

import { updateUserProfileSchema } from "@recipe-planner/shared";
import { validate } from "../../shared/middleware/validate.js";

const router = Router();

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.patch(
  "/profile",
  validate({ body: updateUserProfileSchema }),
  userController.updateProfile,
);

export default router;
