import { Router } from "express";
import { householdController } from "./household.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { validate } from "../../shared/middleware/validate.js";
import {
  createHouseholdSchema,
  joinHouseholdSchema,
} from "@recipe-planner/shared";

const router = Router();

router.use(authenticate);

router.get("/me", householdController.getHousehold);
router.post(
  "/",
  validate({ body: createHouseholdSchema }),
  householdController.create,
);
router.post(
  "/join",
  validate({ body: joinHouseholdSchema }),
  householdController.join,
);
router.post("/leave", householdController.leave);

export default router;
