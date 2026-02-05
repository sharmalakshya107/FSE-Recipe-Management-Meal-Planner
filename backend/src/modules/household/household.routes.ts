import { Router } from "express";
import { householdController } from "./household.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/me", householdController.getHousehold);
router.post("/", householdController.create);
router.post("/join", householdController.join);
router.post("/leave", householdController.leave);

export default router;
