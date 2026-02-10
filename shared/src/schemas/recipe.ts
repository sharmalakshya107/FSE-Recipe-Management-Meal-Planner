import { z } from "zod";
import { unitSchema } from "./common.js";

const ingredientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.number().positive("Amount must be positive"),
  unit: unitSchema,
});

const instructionSchema = z.object({
  step: z.number().int().positive(),
  text: z.string().min(1, "Instruction text is required"),
});

const nutritionSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  fiber: z.number().nonnegative(),
});

const dietaryTagSchema = z.enum([
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
]);

export const recipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(instructionSchema)
    .min(1, "At least one instruction is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  servings: z.number().int().positive("Servings must be at least 1"),
  prepTime: z.number().int().nonnegative(),
  cookTime: z.number().int().nonnegative(),
  dietaryTags: z.array(dietaryTagSchema),
  nutrition: nutritionSchema,
  sourceUrl: z.string().url().optional(),
});

export const importRecipeSchema = z.object({
  url: z.string().url("Invalid recipe URL"),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type ImportRecipeData = z.infer<typeof importRecipeSchema>;
