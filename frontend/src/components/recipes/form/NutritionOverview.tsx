import React from "react";
import { Flame } from "lucide-react";
import { Button } from "../../ui/Button";
import { NutritionInfo } from "@recipe-planner/shared";

interface NutritionOverviewProps {
  nutrition: NutritionInfo;
  onCalculate: () => void;
  isCalculating: boolean;
}

export const NutritionOverview = ({
  nutrition,
  onCalculate,
  isCalculating,
}: NutritionOverviewProps) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 mb-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">
            Nutritional Profile
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black italic">
              {nutrition?.calories || 0}
            </span>
            <span className="text-sm font-bold text-indigo-200">
              kcal / serving
            </span>
          </div>
        </div>
        <Button
          type="button"
          onClick={onCalculate}
          isLoading={isCalculating}
          className="bg-white/20 hover:bg-white/30 border-none text-white rounded-2xl px-6 h-12 font-black backdrop-blur-md transition-all scale-105 active:scale-95"
        >
          <Flame size={18} className="mr-2" />
          Calculate Now
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-6 relative z-10">
        {[
          {
            label: "Protein",
            value: nutrition?.protein,
            unit: "g",
          },
          { label: "Carbs", value: nutrition?.carbs, unit: "g" },
          { label: "Fat", value: nutrition?.fat, unit: "g" },
          { label: "Fiber", value: nutrition?.fiber, unit: "g" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10"
          >
            <p className="text-[8px] font-black uppercase tracking-wider text-indigo-200 mb-0.5">
              {stat.label}
            </p>
            <p className="text-sm font-black">
              {stat.value || 0}
              {stat.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2" />
    </div>
  );
};
