import { Unit } from "./recipe.js";
import { InventoryCategory } from "./common.js";

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
