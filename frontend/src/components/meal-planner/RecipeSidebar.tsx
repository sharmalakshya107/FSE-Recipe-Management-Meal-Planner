import React, { useState } from "react";
import { Search, Utensils, ArrowRight } from "lucide-react";
import { Recipe } from "@recipe-planner/shared";
import { DraggableRecipe } from "./DraggableRecipe";

interface RecipeSidebarProps {
  recipes: Recipe[];
}

export const RecipeSidebar = ({ recipes }: RecipeSidebarProps) => {
  const [recipeSearch, setRecipeSearch] = useState("");

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(recipeSearch.toLowerCase()),
  );

  return (
    <div className="lg:w-80 shrink-0 space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-[700px]">
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-2">My Recipes</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Drag to Calendar
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search dishes..."
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all font-medium"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredRecipes.map((recipe) => (
            <DraggableRecipe key={recipe.id} recipe={recipe} />
          ))}
          {filteredRecipes.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <Utensils size={32} className="mx-auto mb-3" />
              <p className="text-sm font-bold">No recipes found</p>
            </div>
          )}
        </div>

        <button
          onClick={() => (window.location.href = "/recipes")}
          className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
        >
          Manage Recipes
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
