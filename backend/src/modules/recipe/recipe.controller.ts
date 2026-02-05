import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { recipeService } from "./recipe.service.js";
import {
  recipeSchema,
  importRecipeSchema,
  recipeFilterQuerySchema,
  paginationQuerySchema,
  scaleRecipeQuerySchema,
  uuidSchema,
} from "@recipe-planner/shared";
import { BadRequestError, ForbiddenError } from "../../shared/errors/index.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";

const validateId = (id: string | undefined) => {
  const result = uuidSchema.safeParse(id);
  if (!result.success) throw new BadRequestError("Invalid recipe ID format");
  return result.data;
};

export const recipeController = {
  getRecipes: catchAsync(async (req: Request, res: Response) => {
    const filterValidation = recipeFilterQuerySchema.safeParse(req.query);
    const paginationValidation = paginationQuerySchema.safeParse(req.query);

    if (!filterValidation.success || !paginationValidation.success) {
      throw new BadRequestError("Invalid query parameters", {
        errors: {
          ...(filterValidation.success ? {} : filterValidation.error.format()),
          ...(paginationValidation.success
            ? {}
            : paginationValidation.error.format()),
        },
      });
    }

    const { dietaryTags, createdBy, search } = filterValidation.data;
    const { page = 1, limit = 10 } = paginationValidation.data;

    const user = (req as AuthRequest).user;
    let creatorFilter: string | string[] | undefined = createdBy || user.userId;

    if (!createdBy) {
      try {
        const { householdService } =
          await import("../household/household.service.js");
        const household = await householdService.getHousehold(user.userId);
        if (household) {
          creatorFilter = household.memberIds;
        }
      } catch (e) {}
    }

    const result = await recipeService.getRecipes(
      { dietaryTags, createdBy: creatorFilter, search },
      page,
      limit,
    );
    res.json(result);
  }),

  getRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = validateId(req.params["id"]);
    const recipe = await recipeService.getRecipeById(id);
    let isAuthorized = recipe.createdBy === user.userId;

    if (!isAuthorized) {
      try {
        const { householdService } =
          await import("../household/household.service.js");
        const household = await householdService.getHousehold(user.userId);
        if (household && household.memberIds.includes(recipe.createdBy)) {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    if (!isAuthorized) {
      throw new ForbiddenError("Not authorized to view this recipe");
    }

    res.json(recipe);
  }),

  getSharedRecipe: catchAsync(async (req: Request, res: Response) => {
    const recipe = await recipeService.getRecipeByShareId(
      req.params["shareId"]!,
    );
    res.json(recipe);
  }),

  shareRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = validateId(req.params["id"]);
    const shareId = await recipeService.generateShareId(id, user.userId);
    res.json({ shareId, shareUrl: `/recipes/share/${shareId}` });
  }),

  importRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = importRecipeSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Invalid import data", {
        errors: validation.error.format(),
      });
    }
    const recipe = await recipeService.importFromUrl(
      validation.data,
      user.userId,
    );
    res.status(201).json(recipe);
  }),

  calculateNutrition: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = validateId(req.params["id"]);
    const recipe = await recipeService.calculateRecipeNutrition(
      id,
      user.userId,
    );
    res.json(recipe);
  }),

  scaleRecipe: catchAsync(async (req: Request, res: Response) => {
    const validation = scaleRecipeQuerySchema.safeParse(req.query);
    if (!validation.success) {
      throw new BadRequestError("Invalid servings", {
        errors: validation.error.format(),
      });
    }
    const { servings } = validation.data;
    const id = validateId(req.params["id"]);
    const recipe = await recipeService.scaleRecipe(id, servings);
    res.json(recipe);
  }),

  createRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = recipeSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Validation failed", {
        errors: validation.error.format(),
      });
    }

    const recipe = await recipeService.createRecipe(
      validation.data,
      user.userId,
    );
    res.status(201).json(recipe);
  }),

  updateRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const validation = recipeSchema.partial().safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError("Validation failed", {
        errors: validation.error.format(),
      });
    }

    const id = validateId(req.params["id"]);
    const recipe = await recipeService.updateRecipe(
      id,
      validation.data,
      user.userId,
    );
    res.json(recipe);
  }),

  deleteRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = validateId(req.params["id"]);
    await recipeService.deleteRecipe(id, user.userId);
    res.status(204).end();
  }),

  calculateNutritionDry: catchAsync(async (req: Request, res: Response) => {
    const { ingredients, servings } = req.body;
    if (!ingredients || !servings) {
      throw new BadRequestError("Ingredients and servings are required");
    }
    const result = await recipeService.calculateNutritionDry(
      ingredients,
      servings,
    );
    res.json(result);
  }),
};
