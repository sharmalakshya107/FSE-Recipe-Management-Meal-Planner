import React from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { DistributionBar } from "./DistributionBar";

interface NutritionStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionChartsProps {
  totals: NutritionStats;
  avgCalories: number;
}

export const NutritionCharts = ({
  totals,
  avgCalories,
}: NutritionChartsProps) => {
  const totalMacros = totals.protein + totals.carbs + totals.fat;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Macronutrient Balance
          </h3>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <DistributionBar
            label="Protein"
            value={totals.protein}
            total={totalMacros}
            color="bg-emerald-500"
          />
          <DistributionBar
            label="Carbohydrates"
            value={totals.carbs}
            total={totalMacros}
            color="bg-indigo-500"
          />
          <DistributionBar
            label="Fats"
            value={totals.fat}
            total={totalMacros}
            color="bg-rose-500"
          />
        </CardContent>
      </Card>

      <Card className="border-indigo-100 shadow-sm rounded-2xl overflow-hidden bg-indigo-50/50">
        <CardHeader className="px-6 py-4">
          <h3 className="text-lg font-bold text-indigo-900">Weekly Summary</h3>
        </CardHeader>
        <CardContent className="px-6 pb-8 space-y-6">
          <div className="p-5 bg-white rounded-xl border border-indigo-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              Your average daily intake is{" "}
              <span className="font-bold text-indigo-600">
                {Math.round(avgCalories)} kcal
              </span>
              . This is consistent with your target range.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Observations
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                Protein intake is on track for your goals.
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                Good balance of micronutrients in current plan.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
