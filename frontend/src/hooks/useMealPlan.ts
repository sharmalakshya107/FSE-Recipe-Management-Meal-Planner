import {
  useGetMealPlanQuery,
  useUpdateMealPlanMutation,
  useDeleteMealPlanMutation,
} from "../services/api/mealPlanApi";
import { UpdateMealPlanInput, MealType } from "@recipe-planner/shared";
import { useState, useCallback } from "react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const useMealPlan = (startDate: string, endDate: string) => {
  const {
    data: plan,
    isLoading,
    isError,
    refetch,
  } = useGetMealPlanQuery({
    startDate,
    endDate,
  });

  const [updateMealPlan, { isLoading: isUpdating }] =
    useUpdateMealPlanMutation();
  const [deleteMealPlan, { isLoading: isDeleting }] =
    useDeleteMealPlanMutation();

  const addMeal = useCallback(
    async (date: string, recipeId: string, mealType: string) => {
      if (!plan) return;
      const dayEntry = plan.days.find((d) => d.date === date);
      const newSlots = [
        ...(dayEntry?.slots || []),
        {
          id: crypto.randomUUID(),
          recipeId,
          mealType: mealType as MealType,
          servings: 1,
        },
      ];

      const dayOfWeek = DAYS[new Date(date).getUTCDay()];

      await updateMealPlan({
        id: plan.id,
        updates: {
          days: [
            ...plan.days.filter((d) => d.date !== date),
            { date, dayOfWeek, slots: newSlots },
          ],
        },
      }).unwrap();
    },
    [plan, updateMealPlan],
  );

  const removeMeal = useCallback(
    async (date: string, slotId: string) => {
      if (!plan) return;
      const dayEntry = plan.days.find((d) => d.date === date);
      if (!dayEntry) return;

      const newSlots = dayEntry.slots.filter((s) => s.id !== slotId);

      await updateMealPlan({
        id: plan.id,
        updates: {
          days: [
            ...plan.days.filter((d) => d.date !== date),
            { date, dayOfWeek: dayEntry.dayOfWeek, slots: newSlots },
          ],
        },
      }).unwrap();
    },
    [plan, updateMealPlan],
  );

  return {
    plan,
    isLoading,
    isError,
    refetch,
    addMeal,
    removeMeal,
    updateMealPlan,
    deleteMealPlan,
    isUpdating,
    isDeleting,
  };
};
