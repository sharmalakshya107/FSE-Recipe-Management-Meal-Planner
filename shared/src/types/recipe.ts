export type Unit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup"
  | "pcs"
  | "oz"
  | "lb"
  | "piece"
  | "slice"
  | "clove"
  | "whole"
  | "pinch"
  | "dash"
  | "to taste"
  | "unit"
  | "each"
  | "can"
  | "box"
  | "bottle"
  | "pkg"
  | "packet"
  | "bag"
  | "head"
  | "bunch"
  | "sprig"
  | "leaf"
  | "gallon"
  | "quart"
  | "pint"
  | "fl oz";

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
}

export interface Instruction {
  step: number;
  text: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "paleo";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  imageUrl?: string;
  servings: number;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  dietaryTags: DietaryTag[];
  nutrition: NutritionInfo;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sourceUrl?: string; // For imported recipes
  shareId?: string; // For shared recipes
}

export interface CreateRecipeInput extends Omit<
  Recipe,
  "id" | "createdBy" | "createdAt" | "updatedAt" | "shareId"
> {}
export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {}

export interface ImportRecipeInput {
  url: string;
}
