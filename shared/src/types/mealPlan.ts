export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealSlot {
  id: string;
  recipeId: string;
  mealType: MealType;
  servings: number;
}

export interface DayPlan {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: string;
  slots: MealSlot[];
}

export interface MealPlan {
  id: string;
  userId: string;
  householdId?: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMealPlanInput {
  days: DayPlan[];
}
