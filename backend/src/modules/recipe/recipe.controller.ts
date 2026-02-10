import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { recipeService } from "./recipe.service.js";
import { ForbiddenError } from "../../shared/errors/index.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";

export const recipeController = {
  getRecipes: catchAsync(async (req: Request, res: Response) => {
    const {
      dietaryTags,
      createdBy,
      search,
      page = 1,
      limit = 10,
    } = req.query as {
      dietaryTags?: string[];
      createdBy?: string;
      search?: string;
      page?: string;
      limit?: string;
    };

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
      Number(page),
      Number(limit),
    );
    res.json(result);
  }),

  getRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = req.params["id"]!;
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
    const id = req.params["id"]!;
    const shareId = await recipeService.generateShareId(id, user.userId);
    res.json({ shareId, shareUrl: `/recipes/share/${shareId}` });
  }),

  importRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const recipe = await recipeService.importFromUrl(req.body, user.userId);
    res.status(201).json(recipe);
  }),

  calculateNutrition: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = req.params["id"]!;
    const recipe = await recipeService.calculateRecipeNutrition(
      id,
      user.userId,
    );
    res.json(recipe);
  }),

  scaleRecipe: catchAsync(async (req: Request, res: Response) => {
    const { servings } = req.query as { servings: string };
    const id = req.params["id"]!;
    const recipe = await recipeService.scaleRecipe(id, Number(servings));
    res.json(recipe);
  }),

  createRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const recipe = await recipeService.createRecipe(req.body, user.userId);
    res.status(201).json(recipe);
  }),

  updateRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = req.params["id"]!;
    const recipe = await recipeService.updateRecipe(id, req.body, user.userId);
    res.json(recipe);
  }),

  deleteRecipe: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const id = req.params["id"]!;
    await recipeService.deleteRecipe(id, user.userId);
    res.status(204).end();
  }),

  calculateNutritionDry: catchAsync(async (req: Request, res: Response) => {
    const { ingredients, servings } = req.body;
    const result = await recipeService.calculateNutritionDry(
      ingredients,
      servings,
    );
    res.json(result);
  }),
};
