import React from "react";
import { useMealPlan } from "../../hooks/useMealPlan";
import { useRecipes } from "../../hooks/useRecipes";
import { Spinner } from "../../components/feedback/Spinner";
import { NutritionEmptyState } from "../../components/nutrition/NutritionEmptyState";
import { NutritionStatsGrid } from "../../components/nutrition/NutritionStatsGrid";
import { NutritionCharts } from "../../components/nutrition/NutritionCharts";

const NutritionPage = () => {
  const { today, nextWeek } = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const n = new Date(d);
    n.setDate(d.getDate() + 7);
    return {
      today: d.toISOString(),
      nextWeek: n.toISOString(),
    };
  }, []);

  const { plan, isLoading: isPlanLoading } = useMealPlan(today, nextWeek);
  const { recipes, isLoading: isRecipesLoading } = useRecipes({ limit: 1000 });

  const totals = React.useMemo(() => {
    const t = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    if (!plan || !recipes.length) return t;

    const recipeMap = new Map(recipes.map((r) => [r.id, r]));

    plan.days.forEach((day) => {
      day.slots.forEach((slot) => {
        const recipe = recipeMap.get(slot.recipeId);
        if (recipe?.nutrition) {
          t.calories += recipe.nutrition.calories || 0;
          t.protein += recipe.nutrition.protein || 0;
          t.carbs += recipe.nutrition.carbs || 0;
          t.fat += recipe.nutrition.fat || 0;
        }
      });
    });

    return t;
  }, [plan, recipes]);

  const avgCalories = totals.calories / 7;

  if (isPlanLoading || isRecipesLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );

  const hasMeals = plan?.days.some((day) => day.slots.length > 0);

  if (!hasMeals) {
    return <NutritionEmptyState />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Nutrition Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Summary of your nutritional intake for planned meals.
          </p>
        </div>
        <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-sm text-xs font-bold uppercase">
            Weekly
          </button>
          <button className="px-4 py-2 text-gray-400 text-xs font-bold uppercase">
            Monthly
          </button>
        </div>
      </div>

      <NutritionStatsGrid totals={totals} avgCalories={avgCalories} />
      <NutritionCharts totals={totals} avgCalories={avgCalories} />
    </div>
  );
};

export default NutritionPage;
