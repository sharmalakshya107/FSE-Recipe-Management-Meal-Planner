import { Router } from "express";
import { recipeController } from "./recipe.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { importLimiter } from "../../shared/middleware/rateLimit.js";
import { validate } from "../../shared/middleware/validate.js";
import {
  recipeSchema,
  importRecipeSchema,
  recipeFilterQuerySchema,
  paginationQuerySchema,
  scaleRecipeQuerySchema,
  uuidSchema,
  z,
} from "@recipe-planner/shared";

const router = Router();

router.get(
  "/",
  authenticate,
  validate({ query: recipeFilterQuerySchema.merge(paginationQuerySchema) }),
  recipeController.getRecipes,
);

router.get(
  "/:id",
  authenticate,
  validate({ params: z.object({ id: uuidSchema }) }),
  recipeController.getRecipe,
);

router.get(
  "/:id/scale",
  authenticate,
  validate({
    params: z.object({ id: uuidSchema }),
    query: scaleRecipeQuerySchema,
  }),
  recipeController.scaleRecipe,
);

router.get("/share/:shareId", recipeController.getSharedRecipe);

router.post(
  "/",
  authenticate,
  validate({ body: recipeSchema }),
  recipeController.createRecipe,
);

router.post(
  "/import",
  authenticate,
  importLimiter,
  validate({ body: importRecipeSchema }),
  recipeController.importRecipe,
);

router.post(
  "/calculate",
  authenticate,
  validate({
    body: z.object({
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.number(),
          unit: z.string(),
        }),
      ),
      servings: z.number().min(1),
    }),
  }),
  recipeController.calculateNutritionDry,
);

router.post(
  "/:id/share",
  authenticate,
  validate({ params: z.object({ id: uuidSchema }) }),
  recipeController.shareRecipe,
);

router.post(
  "/:id/calculate-nutrition",
  authenticate,
  validate({ params: z.object({ id: uuidSchema }) }),
  recipeController.calculateNutrition,
);

router.put(
  "/:id",
  authenticate,
  validate({
    params: z.object({ id: uuidSchema }),
    body: recipeSchema.partial(),
  }),
  recipeController.updateRecipe,
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: z.object({ id: uuidSchema }) }),
  recipeController.deleteRecipe,
);

export default router;
