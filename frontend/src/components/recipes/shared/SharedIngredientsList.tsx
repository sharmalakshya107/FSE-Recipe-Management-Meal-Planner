import React from "react";
import { Utensils } from "lucide-react";
import { Ingredient } from "@recipe-planner/shared";

interface SharedIngredientsListProps {
  ingredients: Ingredient[];
}

export const SharedIngredientsList = ({
  ingredients,
}: SharedIngredientsListProps) => {
  return (
    <section>
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <Utensils size={20} />
        </div>
        Ingredients
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ingredients.map((ing) => (
          <div
            key={ing.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-sm font-black text-indigo-600">
                {ing.amount}
              </span>
              <span className="text-[8px] font-black uppercase text-gray-400">
                {ing.unit}
              </span>
            </div>
            <span className="text-gray-700 font-bold">{ing.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
