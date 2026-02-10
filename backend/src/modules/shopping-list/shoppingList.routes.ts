import { Router } from "express";
import { shoppingListController } from "./shoppingList.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { validate } from "../../shared/middleware/validate.js";
import { dateRangeQuerySchema } from "@recipe-planner/shared";

const router = Router();

router.get(
  "/generate",
  authenticate,
  validate({ query: dateRangeQuerySchema }),
  shoppingListController.getGeneratedList,
);

export default router;
