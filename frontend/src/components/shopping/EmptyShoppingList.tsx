import React from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export const EmptyShoppingList = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Shopping List
        </h1>
      </div>
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Items to Shop For
          </h3>
          <p className="text-gray-600 mb-6">
            Your shopping list is empty. Add meals to your meal planner to
            generate a shopping list automatically.
          </p>
          <Button
            onClick={() => navigate("/meal-planner")}
            className="btn-primary w-full py-4 rounded-xl font-bold"
          >
            Go to Meal Planner
            <ChevronRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
