import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { config } from "../../config/index.js";
import { SimpleCache } from "../../shared/utils/cache.js";
import {
  Recipe,
  CreateRecipeInput,
  UpdateRecipeInput,
  ImportRecipeInput,
} from "@recipe-planner/shared";
import { recipeRepository } from "./recipe.repository.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../shared/errors/index.js";

const recipeCache = new SimpleCache<{ data: Recipe[]; total: number }>(60000);
const singleRecipeCache = new SimpleCache<Recipe>(60000);

export const recipeService = {
  getRecipes: async (
    filters?: {
      createdBy?: string | string[];
      dietaryTags?: string | string[];
      search?: string;
    },
    page: number = 1,
    limit: number = 10,
  ) => {
    const dietaryTags =
      typeof filters?.dietaryTags === "string"
        ? filters.dietaryTags.split(",").filter(Boolean)
        : filters?.dietaryTags?.filter(Boolean);

    const normalizedFilters = {
      createdBy: filters?.createdBy || undefined,
      tags: dietaryTags?.length ? dietaryTags : undefined,
      search: filters?.search?.trim() || undefined,
    };

    // CRITICAL SECURITY GUARD: Never return all recipes without owner filter
    if (
      !normalizedFilters.createdBy ||
      (Array.isArray(normalizedFilters.createdBy) &&
        normalizedFilters.createdBy.length === 0)
    ) {
      console.warn(
        "Security Alert: Attempt to fetch recipes without createdBy filter",
      );
      // Return empty instead of throwing to be graceful, or throw?
      // Throwing is safer to signal bug.
      // But for user experience, maybe empty list?
      // Let's return empty result to fail closed safe.
      return { data: [], total: 0 };
    }

    const cacheKey = JSON.stringify({
      filters: normalizedFilters,
      page,
      limit,
    });
    const cached = recipeCache.get(cacheKey);
    if (cached) return cached;

    const result = await recipeRepository.findAll(
      normalizedFilters,
      page,
      limit,
    );
    recipeCache.set(cacheKey, result);
    return result;
  },

  getRecipeById: async (id: string) => {
    const cached = singleRecipeCache.get(id);
    if (cached) return cached;

    const recipe = await recipeRepository.findById(id);
    if (!recipe) throw new NotFoundError("Recipe not found");

    singleRecipeCache.set(id, recipe);
    return recipe;
  },

  getRecipesByIds: async (ids: string[]) => {
    return recipeRepository.findByIds(ids);
  },

  getRecipeByShareId: async (shareId: string) => {
    const recipe = await recipeRepository.findByShareId(shareId);
    if (!recipe) throw new NotFoundError("Shared recipe not found");
    return recipe;
  },

  generateShareId: async (id: string, userId: string) => {
    const recipe = await recipeService.getRecipeById(id);
    if (recipe.createdBy !== userId)
      throw new ForbiddenError("Only owner can share recipe");

    if (recipe.shareId) return recipe.shareId;

    const shareId = uuidv4().split("-")[0];
    await recipeRepository.update(id, { shareId });
    return shareId;
  },

  createRecipe: async (
    input: CreateRecipeInput,
    userId: string,
  ): Promise<Recipe> => {
    const now = new Date().toISOString();

    let nutrition = input.nutrition;
    const hasNutrition =
      nutrition &&
      (nutrition.calories > 0 ||
        nutrition.protein > 0 ||
        nutrition.carbs > 0 ||
        nutrition.fat > 0);

    if (!hasNutrition && input.ingredients && input.ingredients.length > 0) {
      try {
        const { nutritionService } = await import("./nutrition.service.js");
        nutrition = await nutritionService.calculateNutrition(
          input.ingredients,
          input.servings || 1,
        );
        console.log(
          `Auto-calculated nutrition for "${input.title}":`,
          nutrition,
        );
      } catch (error) {
        console.error("Failed to calculate nutrition:", error);
        nutrition = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
        };
      }
    }

    const recipe: Recipe = {
      ...input,
      nutrition: nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      id: uuidv4(),
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };
    const saved = await recipeRepository.save(recipe);
    recipeCache.clear();
    return saved;
  },

  updateRecipe: async (
    id: string,
    input: UpdateRecipeInput,
    userId: string,
  ): Promise<Recipe> => {
    const existing = await recipeRepository.findById(id);
    if (!existing) throw new NotFoundError("Recipe not found");
    if (existing.createdBy !== userId)
      throw new ForbiddenError("Not authorized to update this recipe");

    const updated: Recipe = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    const saved = await recipeRepository.save(updated);
    recipeCache.clear();
    singleRecipeCache.delete(id);
    return saved;
  },

  deleteRecipe: async (id: string, userId: string): Promise<void> => {
    const existing = await recipeRepository.findById(id);
    if (!existing) throw new NotFoundError("Recipe not found");
    if (existing.createdBy !== userId)
      throw new ForbiddenError("Not authorized to delete this recipe");

    await recipeRepository.delete(id);
    recipeCache.clear();
    singleRecipeCache.delete(id);
  },

  importFromUrl: async (
    input: ImportRecipeInput,
    userId: string,
  ): Promise<Recipe> => {
    const { scrapeRecipe } = await import("./scraper.utils.js");
    const scrapedData = await scrapeRecipe(input.url);

    const recipeInput: CreateRecipeInput = {
      title: scrapedData.title || "Untitled Recipe",
      description: scrapedData.description || `Imported from ${input.url}`,
      ingredients: scrapedData.ingredients || [],
      instructions: scrapedData.instructions || [],
      prepTime: scrapedData.prepTime || 0,
      cookTime: scrapedData.cookTime || 0,
      servings: scrapedData.servings || 4,
      dietaryTags: scrapedData.dietaryTags || [],
      nutrition: scrapedData.nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      sourceUrl: input.url,
      imageUrl: scrapedData.imageUrl,
    };

    return recipeService.createRecipe(recipeInput, userId);
  },

  calculateRecipeNutrition: async (
    recipeId: string,
    userId: string,
  ): Promise<Recipe> => {
    const recipe = await recipeService.getRecipeById(recipeId);
    if (recipe.createdBy !== userId) throw new ForbiddenError("Not authorized");

    try {
      const { nutritionService } = await import("./nutrition.service.js");
      const nutrition = await nutritionService.calculateNutrition(
        recipe.ingredients,
        recipe.servings || 1,
      );

      return recipeService.updateRecipe(recipeId, { nutrition }, userId);
    } catch (error) {
      console.error("Failed to calculate nutrition:", error);
      throw new Error("Failed to calculate recipe nutrition");
    }
  },

  scaleRecipe: async (
    recipeId: string,
    newServings: number,
  ): Promise<Recipe> => {
    const recipe = await recipeService.getRecipeById(recipeId);
    if (newServings <= 0)
      throw new BadRequestError("Servings must be positive");

    const factor = newServings / recipe.servings;

    const scaledRecipe: Recipe = {
      ...recipe,
      servings: newServings,
      ingredients: recipe.ingredients.map((ing) => ({
        ...ing,
        amount: Math.ceil(ing.amount * factor * 100) / 100,
      })),
      nutrition: {
        calories: Math.ceil(recipe.nutrition.calories * factor * 100) / 100,
        protein: Math.ceil(recipe.nutrition.protein * factor * 100) / 100,
        carbs: Math.ceil(recipe.nutrition.carbs * factor * 100) / 100,
        fat: Math.ceil(recipe.nutrition.fat * factor * 100) / 100,
        fiber: Math.ceil(recipe.nutrition.fiber * factor * 100) / 100,
      },
    };

    return scaledRecipe;
  },

  calculateNutritionDry: async (
    ingredients: import("@recipe-planner/shared").Ingredient[],
    servings: number,
  ): Promise<import("@recipe-planner/shared").NutritionInfo> => {
    const { nutritionService } = await import("./nutrition.service.js");
    return nutritionService.calculateNutrition(ingredients, servings);
  },
};
