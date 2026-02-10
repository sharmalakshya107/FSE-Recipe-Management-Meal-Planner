import React from "react";
import { StatCard } from "./StatCard";

interface NutritionStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionStatsGridProps {
  totals: NutritionStats;
  avgCalories: number;
}

export const NutritionStatsGrid = ({
  totals,
  avgCalories,
}: NutritionStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Daily Average"
        value={Math.round(avgCalories)}
        suffix="kcal"
        color="border-amber-200"
      />
      <StatCard
        title="Total Protein"
        value={Math.round(totals.protein)}
        suffix="g"
        color="border-emerald-200"
      />
      <StatCard
        title="Total Carbs"
        value={Math.round(totals.carbs)}
        suffix="g"
        color="border-indigo-200"
      />
      <StatCard
        title="Total Fats"
        value={Math.round(totals.fat)}
        suffix="g"
        color="border-rose-200"
      />
    </div>
  );
};
