import React from "react";
import { DayPlan, Recipe, MealSlot } from "@recipe-planner/shared";
import { MEAL_TYPES, DAYS, DragItem } from "./constants";
import { DropSlot } from "./DropSlot";

interface DayColumnProps {
  date: Date;
  dayPlan?: DayPlan;
  recipes: Recipe[];
  isToday: boolean;
  onAdd: (date: Date, type: string) => void;
  onRemove: (date: string, id: string) => void;
  onUpdateServings: (date: string, id: string, servings: number) => void;
  onDrop: (item: DragItem, targetDate: string, targetType: string) => void;
}

export const DayColumn = ({
  date,
  dayPlan,
  recipes,
  isToday,
  onAdd,
  onRemove,
  onUpdateServings,
  onDrop,
}: DayColumnProps) => {
  const dailyTotals = (dayPlan?.slots || []).reduce(
    (
      acc: { calories: number; protein: number; carbs: number; fat: number },
      slot: MealSlot,
    ) => {
      const recipe = recipes.find((r) => r.id === slot.recipeId);
      if (recipe) {
        const factor = slot.servings / recipe.servings;
        acc.calories += recipe.nutrition.calories * factor;
        acc.protein += recipe.nutrition.protein * factor;
        acc.carbs += recipe.nutrition.carbs * factor;
        acc.fat += recipe.nutrition.fat * factor;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <div
      className={`
      flex-1 min-w-[260px] snap-start space-y-4 pt-2
      ${isToday ? "relative" : ""}
    `}
    >
      <div className="text-center group">
        <p
          className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? "text-indigo-600" : "text-gray-400"}`}
        >
          {DAYS[date.getDay()]}
        </p>
        <div
          className={`
          inline-flex items-center justify-center w-12 h-12 rounded-2xl text-xl font-black transition-all
          ${isToday ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110" : "bg-white text-gray-900 border border-gray-100"}
        `}
        >
          {date.getDate()}
        </div>

        {dailyTotals.calories > 0 && (
          <div className="mt-4 px-3 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Calories
              </span>
              <span className="text-xs font-black text-gray-900 italic">
                {Math.round(dailyTotals.calories)}{" "}
                <span className="text-[8px] text-gray-400 not-italic">
                  kcal
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-emerald-50 rounded-lg p-1 text-center">
                <p className="text-[6px] font-black text-emerald-600 uppercase">
                  P
                </p>
                <p className="text-[8px] font-black text-emerald-950 leading-none">
                  {Math.round(dailyTotals.protein)}g
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-1 text-center">
                <p className="text-[6px] font-black text-amber-600 uppercase">
                  C
                </p>
                <p className="text-[8px] font-black text-amber-950 leading-none">
                  {Math.round(dailyTotals.carbs)}g
                </p>
              </div>
              <div className="bg-rose-50 rounded-lg p-1 text-center">
                <p className="text-[6px] font-black text-rose-600 uppercase">
                  F
                </p>
                <p className="text-[8px] font-black text-rose-950 leading-none">
                  {Math.round(dailyTotals.fat)}g
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {MEAL_TYPES.map((type) => (
          <DropSlot
            key={type.id}
            date={date}
            mealType={type}
            slots={dayPlan?.slots.filter((s) => s.mealType === type.id) || []}
            recipes={recipes}
            onAdd={onAdd}
            onRemove={onRemove}
            onUpdateServings={onUpdateServings}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};
