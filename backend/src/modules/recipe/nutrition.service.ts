import axios from "axios";
import { NutritionInfo } from "@recipe-planner/shared";
import { nutritionConfig } from "../../config/nutrition.js";

interface IngredientInput {
  name: string;
  amount: number;
  unit: string;
}

const nutritionCache = new Map<string, NutritionInfo>();

export const nutritionService = {
  calculateNutrition: async (
    ingredients: IngredientInput[],
    servings: number = 1,
  ): Promise<NutritionInfo> => {
    const totals: NutritionInfo = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    for (const ingredient of ingredients) {
      try {
        const nutrition = await getNutritionForIngredient(ingredient);
        totals.calories += nutrition.calories;
        totals.protein += nutrition.protein;
        totals.carbs += nutrition.carbs;
        totals.fat += nutrition.fat;
        totals.fiber += nutrition.fiber;
      } catch (error) {
        console.warn(`Failed to get nutrition for ${ingredient.name}:`, error);
      }
    }

    return {
      calories: Math.round(totals.calories / servings),
      protein: Math.round(totals.protein / servings),
      carbs: Math.round(totals.carbs / servings),
      fat: Math.round(totals.fat / servings),
      fiber: Math.round(totals.fiber / servings),
    };
  },
};

async function getNutritionForIngredient(
  ingredient: IngredientInput,
): Promise<NutritionInfo> {
  const cacheKey = `${ingredient.name.toLowerCase()}_${ingredient.amount}_${ingredient.unit}`;

  if (nutritionCache.has(cacheKey)) {
    return nutritionCache.get(cacheKey) as NutritionInfo;
  }

  if (nutritionConfig.usda.enabled) {
    try {
      const searchResult = await searchUSDAFood(ingredient.name);
      if (searchResult) {
        const nutrition = calculateFromUSDAData(
          searchResult,
          ingredient.amount,
          ingredient.unit,
        );
        nutritionCache.set(cacheKey, nutrition);
        return nutrition;
      }
    } catch (error) {
      console.warn("USDA API failed:", error);
    }
    // If enabled but failed/not found, return zeros (do not ESTIMATE)
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }

  return estimateNutrition(ingredient);
}

async function searchUSDAFood(
  ingredientName: string,
): Promise<Record<string, unknown> | null> {
  try {
    const response = await axios.get(
      `${nutritionConfig.usda.baseUrl}/foods/search`,
      {
        params: {
          query: ingredientName,
          pageSize: 1,
          api_key: nutritionConfig.usda.apiKey,
        },
        timeout: nutritionConfig.usda.timeout,
      },
    );

    if (response.data.foods && response.data.foods.length > 0) {
      return response.data.foods[0];
    }
  } catch (error) {
    console.error("USDA search failed:", error);
  }
  return null;
}

function calculateFromUSDAData(
  food: Record<string, unknown>,
  amount: number,
  unit: string,
): NutritionInfo {
  const nutrients = (food.foodNutrients as Record<string, unknown>[]) || [];

  const grams = convertToGrams(amount, unit);
  const multiplier = grams / 100;

  const getNutrient = (nutrientId: number) => {
    const nutrient = nutrients.find((n) => n.nutrientId === nutrientId);
    return nutrient ? (nutrient.value as number) * multiplier : 0;
  };

  return {
    calories: Math.round(getNutrient(1008)),
    protein: Math.round(getNutrient(1003)),
    carbs: Math.round(getNutrient(1005)),
    fat: Math.round(getNutrient(1004)),
    fiber: Math.round(getNutrient(1079)),
  };
}

function convertToGrams(amount: number, unit: string): number {
  const conversions: Record<string, number> = {
    g: 1,
    kg: 1000,
    oz: 28.35,
    lb: 453.59,
    ml: 1,
    l: 1000,
    cup: 240,
    cups: 240,
    tbsp: 15,
    tsp: 5,
    piece: 100,
    pieces: 100,
    pcs: 100,
    unit: 100,
    slice: 30,
    slices: 30,
  };

  const factor = conversions[unit.toLowerCase()] || 100;
  return amount * factor;
}

function estimateNutrition(ingredient: IngredientInput): NutritionInfo {
  const name = ingredient.name.toLowerCase();
  const grams = convertToGrams(ingredient.amount, ingredient.unit);

  const estimates: Record<string, NutritionInfo> = {
    potato: { calories: 77, protein: 2, carbs: 17, fat: 0, fiber: 2 },
    tomato: { calories: 18, protein: 1, carbs: 4, fat: 0, fiber: 1 },
    onion: { calories: 40, protein: 1, carbs: 9, fat: 0, fiber: 2 },
    carrot: { calories: 41, protein: 1, carbs: 10, fat: 0, fiber: 3 },
    lettuce: { calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 1 },
    chicken: { calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0 },
    beef: { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0 },
    egg: { calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0 },
    rice: { calories: 130, protein: 3, carbs: 28, fat: 0, fiber: 0 },
    bread: { calories: 265, protein: 9, carbs: 49, fat: 3, fiber: 2 },
    flour: { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 3 },
    milk: { calories: 42, protein: 3, carbs: 5, fat: 1, fiber: 0 },
    cheese: { calories: 402, protein: 25, carbs: 1, fat: 33, fiber: 0 },
    butter: { calories: 717, protein: 1, carbs: 0, fat: 81, fiber: 0 },
    oil: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  };

  for (const [key, value] of Object.entries(estimates)) {
    if (name.includes(key)) {
      const multiplier = grams / 100;
      return {
        calories: Math.round(value.calories * multiplier),
        protein: Math.round(value.protein * multiplier),
        carbs: Math.round(value.carbs * multiplier),
        fat: Math.round(value.fat * multiplier),
        fiber: Math.round(value.fiber * multiplier),
      };
    }
  }

  const multiplier = grams / 100;
  return {
    calories: Math.round(40 * multiplier),
    protein: Math.round(1 * multiplier),
    carbs: Math.round(9 * multiplier),
    fat: 0,
    fiber: Math.round(2 * multiplier),
  };
}
