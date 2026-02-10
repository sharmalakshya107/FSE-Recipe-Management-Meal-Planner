import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync.js";
import { inventoryService } from "../inventory/inventory.service.js";
import { mealPlanService } from "../meal-plan/mealPlan.service.js";
import { recipeService } from "../recipe/recipe.service.js";
import { generateShoppingList } from "./shoppingList.utils.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";

export const shoppingListController = {
  getGeneratedList: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const { startDate, endDate } = req.query as {
      startDate: string;
      endDate: string;
    };

    const plan = await mealPlanService.getWeeklyPlan(
      user.userId,
      startDate,
      endDate,
    );
    const inventory = await inventoryService.getInventory(user.userId);

    const recipeIds = new Set<string>();
    plan.days.forEach((day) =>
      day.slots.forEach((slot) => recipeIds.add(slot.recipeId)),
    );

    const recipes = await recipeService.getRecipesByIds(Array.from(recipeIds));

    const list = generateShoppingList(
      plan.days,
      recipes,
      inventory,
      user.userId,
    );
    res.json(list);
  }),
};
