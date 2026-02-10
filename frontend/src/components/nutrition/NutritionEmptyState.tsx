import React from "react";
import { Flame, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const NutritionEmptyState = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Nutrition Overview
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Track your nutritional intake across your meal plan.
        </p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flame size={40} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Nutrition Data Yet
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Add meals to your meal planner to see your nutritional breakdown and
            track your daily intake.
          </p>
          <Link
            to="/meal-planner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Go to Meal Planner
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
