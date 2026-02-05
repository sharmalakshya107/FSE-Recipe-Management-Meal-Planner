import { Router } from "express";
import { recipeController } from "./recipe.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { importLimiter } from "../../shared/middleware/rateLimit.js";

const router = Router();

router.get("/", authenticate, recipeController.getRecipes);
router.get("/:id", authenticate, recipeController.getRecipe);
router.get("/:id/scale", authenticate, recipeController.scaleRecipe);
router.get("/share/:shareId", recipeController.getSharedRecipe);

router.post("/", authenticate, recipeController.createRecipe);
router.post(
  "/import",
  authenticate,
  importLimiter,
  recipeController.importRecipe,
);
router.post("/calculate", authenticate, recipeController.calculateNutritionDry);
router.post("/:id/share", authenticate, recipeController.shareRecipe);
router.post(
  "/:id/calculate-nutrition",
  authenticate,
  recipeController.calculateNutrition,
);

router.put("/:id", authenticate, recipeController.updateRecipe);
router.delete("/:id", authenticate, recipeController.deleteRecipe);

export default router;
