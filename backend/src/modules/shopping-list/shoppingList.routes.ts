import { Router } from "express";
import { shoppingListController } from "./shoppingList.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();

router.get("/generate", authenticate, shoppingListController.getGeneratedList);

export default router;
