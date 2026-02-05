import { useCallback, useRef, useEffect } from "react";
import { MealPlan, Recipe, MealType, DayPlan } from "@recipe-planner/shared";
import {
  DAYS,
  ITEM_TYPES,
  DragItem,
  MEAL_TYPES,
} from "../components/meal-planner/constants";

interface UseMealPlanActionsProps {
  plan: MealPlan | undefined;
  recipes: Recipe[];
  startOfWeek: Date;
  endOfWeek: Date;
  updateMealPlan: (args: {
    id: string;
    updates: { days: DayPlan[] };
    range: { startDate: string; endDate: string };
  }) => { unwrap: () => Promise<MealPlan> };
  addToast: (message: string, type: "success" | "error" | "info") => void;
  formatDateLocal: (date: Date) => string;
}

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const useMealPlanActions = ({
  plan,
  recipes,
  startOfWeek,
  endOfWeek,
  updateMealPlan,
  addToast,
  formatDateLocal,
}: UseMealPlanActionsProps) => {
  const daysRef = useRef<DayPlan[]>(plan?.days || []);

  useEffect(() => {
    if (plan?.days) {
      daysRef.current = plan.days;
    }
  }, [plan?.days]);

  const handleDrop = useCallback(
    async (
      item: DragItem,
      targetDate: string,
      targetType: string,
      servingsOverride?: number,
    ) => {
      if (!plan) return;

      const allDaysMap = new Map(
        daysRef.current
          .filter(Boolean)
          .map((d) => [d.date, { ...d, slots: [...d.slots] }]),
      );

      const getOrCreateDay = (date: string) => {
        let day = allDaysMap.get(date);
        if (!day) {
          const [y, m, d] = date.split("-").map(Number);
          const dayOfWeek = DAYS[new Date(y, m - 1, d).getDay()];
          day = { date, dayOfWeek, slots: [] };
          allDaysMap.set(date, day);
        }
        return day;
      };

      try {
        if (item.type === ITEM_TYPES.MEAL) {
          if (
            item.originalDate === targetDate &&
            item.originalType === targetType
          )
            return;

          const sDay = allDaysMap.get(item.originalDate!);
          if (!sDay) return;

          const sourceSlot = sDay.slots.find((s) => s.id === item.slotId);
          if (!sourceSlot) return;

          sDay.slots = sDay.slots.filter((s) => s.id !== item.slotId);
          allDaysMap.set(item.originalDate!, sDay);

          const tDay = getOrCreateDay(targetDate);

          tDay.slots.push({
            ...sourceSlot,
            id: generateId(),
            mealType: targetType as MealType,
          });

          allDaysMap.set(targetDate, tDay);

          const updatedDays = Array.from(allDaysMap.values());
          daysRef.current = updatedDays;

          await updateMealPlan({
            id: plan.id,
            updates: { days: updatedDays },
            range: {
              startDate: formatDateLocal(startOfWeek),
              endDate: formatDateLocal(endOfWeek),
            },
          }).unwrap();
        } else if (item.type === ITEM_TYPES.RECIPE) {
          const tDay = getOrCreateDay(targetDate);

          const recipe = recipes.find((r) => r.id === item.recipeId);
          if (!recipe) return;

          tDay.slots.push({
            id: generateId(),
            recipeId: item.recipeId!,
            mealType: targetType as MealType,
            servings: servingsOverride || recipe.servings || 1,
          });
          allDaysMap.set(targetDate, tDay);

          const updatedDays = Array.from(allDaysMap.values());
          daysRef.current = updatedDays;

          await updateMealPlan({
            id: plan.id,
            updates: { days: updatedDays },
            range: {
              startDate: formatDateLocal(startOfWeek),
              endDate: formatDateLocal(endOfWeek),
            },
          }).unwrap();
          addToast("Meal scheduled!", "success");
        }
      } catch (err) {
        console.error("Failed to update meal plan:", err);
        addToast("Failed to update meal plan", "error");
      }
    },
    [
      plan,
      recipes,
      startOfWeek,
      endOfWeek,
      updateMealPlan,
      addToast,
      formatDateLocal,
    ],
  );

  const handleUpdateServings = useCallback(
    async (date: string, slotId: string, newServings: number) => {
      if (!plan || newServings < 1 || newServings > 50) return;
      const allDaysMap = new Map(
        daysRef.current
          .filter(Boolean)
          .map((d) => [d.date, { ...d, slots: [...d.slots] }]),
      );

      const dayEntry = allDaysMap.get(date);
      if (!dayEntry) return;

      const updatedSlots = dayEntry.slots.map((s) =>
        s.id === slotId ? { ...s, servings: newServings } : s,
      );

      dayEntry.slots = updatedSlots;
      allDaysMap.set(date, dayEntry);

      const updatedDays = Array.from(allDaysMap.values());
      daysRef.current = updatedDays;

      try {
        await updateMealPlan({
          id: plan.id,
          updates: { days: updatedDays },
          range: {
            startDate: formatDateLocal(startOfWeek),
            endDate: formatDateLocal(endOfWeek),
          },
        }).unwrap();
      } catch (err) {
        addToast("Failed to update servings", "error");
      }
    },
    [plan, startOfWeek, endOfWeek, updateMealPlan, addToast, formatDateLocal],
  );

  const handleRemoveMeal = useCallback(
    async (date: string, slotId: string) => {
      if (!plan) return;
      const days = daysRef.current;
      const dayEntry = days.find((d) => d && d.date === date);
      if (!dayEntry) return;

      const newSlots = dayEntry.slots.filter((s) => s.id !== slotId);
      const updatedDays = [
        ...days.filter((d) => d && d.date !== date),
        { date, dayOfWeek: dayEntry.dayOfWeek, slots: newSlots },
      ];

      daysRef.current = updatedDays;

      try {
        await updateMealPlan({
          id: plan.id,
          updates: {
            days: updatedDays,
          },
          range: {
            startDate: formatDateLocal(startOfWeek),
            endDate: formatDateLocal(endOfWeek),
          },
        }).unwrap();
      } catch (err) {
        addToast("Failed to remove meal", "error");
      }
    },
    [plan, startOfWeek, endOfWeek, updateMealPlan, addToast, formatDateLocal],
  );

  return {
    handleDrop,
    handleUpdateServings,
    handleRemoveMeal,
  };
};
