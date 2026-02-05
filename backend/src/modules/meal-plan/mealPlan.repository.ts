import { MealPlan } from "@recipe-planner/shared";
import { MealPlanModel } from "./mealPlan.model.js";

export const mealPlanRepository = {
  findByUserAndDateRange: async (
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<MealPlan[]> => {
    const plans = await MealPlanModel.find({
      $or: [{ userId }, { householdId: userId }],
      $and: [
        {
          $or: [
            { startDate: { $gte: startDate, $lte: endDate } },
            { endDate: { $gte: startDate, $lte: endDate } },
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
          ],
        },
      ],
    }).lean();

    return plans.map(mapDocToMealPlan);
  },

  findByUserId: async (userId: string): Promise<MealPlan[]> => {
    const plans = await MealPlanModel.find({ userId }).lean();
    return plans.map(mapDocToMealPlan);
  },

  findById: async (id: string): Promise<MealPlan | undefined> => {
    const plan = await MealPlanModel.findOne({ _id: id }).lean();
    if (!plan) return undefined;
    return mapDocToMealPlan(plan);
  },

  create: async (mealPlan: MealPlan): Promise<MealPlan> => {
    const docToSave = {
      ...mealPlan,
      _id: mealPlan.id,
    };
    await MealPlanModel.create(docToSave);
    return mealPlan;
  },

  update: async (
    userId: string,
    startDate: string,
    updates: Partial<MealPlan>,
  ): Promise<MealPlan | undefined> => {
    const updated = await MealPlanModel.findOneAndUpdate(
      { userId, startDate },
      { $set: updates },
      { new: true },
    ).lean();

    if (!updated) return undefined;
    return mapDocToMealPlan(updated);
  },

  save: async (mealPlan: MealPlan): Promise<MealPlan> => {
    const exists = await MealPlanModel.exists({ _id: mealPlan.id });
    const docToSave = { ...mealPlan, _id: mealPlan.id };

    if (exists) {
      await MealPlanModel.updateOne({ _id: mealPlan.id }, docToSave);
    } else {
      await MealPlanModel.create(docToSave);
    }
    return mealPlan;
  },
};

const mapDocToMealPlan = (doc: unknown): MealPlan => {
  const { _id, ...rest } = doc as Record<string, unknown>;
  return {
    id: _id as string,
    ...(rest as unknown as Omit<MealPlan, "id">),
  };
};
