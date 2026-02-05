import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import recipeRoutes from "./modules/recipe/recipe.routes.js";
import mealPlanRoutes from "./modules/meal-plan/mealPlan.routes.js";
import shoppingListRoutes from "./modules/shopping-list/shoppingList.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import householdRoutes from "./modules/household/household.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/recipes", recipeRoutes);
router.use("/meal-planner", mealPlanRoutes);
router.use("/shopping-list", shoppingListRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/household", householdRoutes);
router.use("/upload", uploadRoutes);
router.use("/users", userRoutes);

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
