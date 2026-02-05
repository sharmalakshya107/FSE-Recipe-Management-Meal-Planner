import { v4 as uuidv4 } from "uuid";
import { MealPlan, UpdateMealPlanInput } from "@recipe-planner/shared";
import { mealPlanRepository } from "./mealPlan.repository.js";

export const mealPlanService = {
  getWeeklyPlan: async (
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<MealPlan> => {
    let targetId = userId;
    let hId: string | undefined;

    try {
      const { householdService } =
        await import("../household/household.service.js");
      const household = await householdService.getHousehold(userId);
      if (household) {
        targetId = household.id;
        hId = household.id;
      }
    } catch (e) {}

    const plans = await mealPlanRepository.findByUserAndDateRange(
      targetId,
      startDate,
      endDate,
    );

    let plan = plans[0];

    if (!plan) {
      const now = new Date().toISOString();
      plan = {
        id: uuidv4(),
        userId: targetId,
        householdId: hId,
        startDate,
        endDate,
        days: [],
        createdAt: now,
        updatedAt: now,
      };
      await mealPlanRepository.save(plan);
    }
    return plan;
  },

  updatePlan: async (
    id: string,
    input: UpdateMealPlanInput,
    userId: string,
  ): Promise<MealPlan> => {
    const existing = await mealPlanRepository.findById(id);
    if (!existing) throw new Error("Meal plan not found");

    let isAuthorized = existing.userId === userId;

    if (!isAuthorized && existing.householdId) {
      try {
        const { householdService } =
          await import("../household/household.service.js");
        const household = await householdService.getHousehold(userId);
        if (household && household.id === existing.householdId) {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    if (!isAuthorized) throw new Error("Unauthorized to update this meal plan");

    const updated: MealPlan = {
      ...existing,
      days: input.days,
      updatedAt: new Date().toISOString(),
    };
    return mealPlanRepository.save(updated);
  },
};
