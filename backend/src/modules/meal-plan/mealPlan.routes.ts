import { Router } from "express";
import { mealPlanController } from "./mealPlan.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { validate } from "../../shared/middleware/validate.js";
import {
  dateRangeQuerySchema,
  updateMealPlanSchema,
  uuidSchema,
  z,
} from "@recipe-planner/shared";

const router = Router();

router.get(
  "/",
  authenticate,
  validate({ query: dateRangeQuerySchema }),
  mealPlanController.getPlan,
);

router.put(
  "/:id",
  authenticate,
  validate({
    params: z.object({ id: uuidSchema }),
    body: updateMealPlanSchema,
  }),
  mealPlanController.updatePlan,
);

export default router;
