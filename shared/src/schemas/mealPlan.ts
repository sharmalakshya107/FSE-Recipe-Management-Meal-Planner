import { z } from "zod";

export const mealSlotSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  servings: z.number().min(1),
  isCooked: z.boolean().optional(),
});

export const dayPlanSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  dayOfWeek: z.string(),
  slots: z.array(mealSlotSchema),
});

export const weekPlanSchema = z.array(dayPlanSchema); // Just validating the structure if needed

// For updating a specific plan ID, we might accept a partial or full day plan update
export const updateMealPlanSchema = z.object({
  days: z.array(dayPlanSchema).optional(),
  // Or specific slots update? Keeping it simple for now based on typical usage
});

export const addMealSchema = z.object({
  recipeId: z.string().min(1, "Recipe is required"),
  servings: z.number().min(1, "Servings must be at least 1"),
});

export type AddMealData = z.infer<typeof addMealSchema>;
