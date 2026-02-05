import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);

export default router;
