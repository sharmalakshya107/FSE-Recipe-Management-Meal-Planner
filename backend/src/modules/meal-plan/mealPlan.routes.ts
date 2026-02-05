import { Router } from "express";
import { mealPlanController } from "./mealPlan.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();

router.get("/", authenticate, mealPlanController.getPlan);
router.put("/:id", authenticate, mealPlanController.updatePlan);

export default router;
