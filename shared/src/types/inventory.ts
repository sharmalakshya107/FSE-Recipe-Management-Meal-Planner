import { Unit } from "./recipe.js";

export enum InventoryCategory {
  Produce = "Produce",
  Dairy = "Dairy",
  Pantry = "Pantry",
  Meat = "Meat",
  Frozen = "Frozen",
  Spices = "Spices",
  Other = "Other",
}

export interface InventoryItem {
  id: string;
  userId: string;
  householdId?: string;
  name: string;
  amount: number;
  unit: Unit;
  expiryDate?: string;
  category?: InventoryCategory;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  userId: string;
  householdId?: string;
  name: string;
  amount: number;
  unit: Unit;
  isPurchased: boolean;
  recipeId?: string;
}

export interface CreateInventoryInput extends Omit<
  InventoryItem,
  "id" | "userId" | "updatedAt"
> {}
export interface UpdateInventoryInput extends Partial<CreateInventoryInput> {}
