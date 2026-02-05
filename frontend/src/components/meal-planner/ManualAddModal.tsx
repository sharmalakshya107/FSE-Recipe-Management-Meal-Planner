import React from "react";
import { Utensils } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Recipe } from "@recipe-planner/shared";

interface ManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMealType: string;
  selectedRecipeId: string;
  modalServings: number;
  recipes: Recipe[];
  onRecipeChange: (id: string) => void;
  onServingsChange: (servings: number) => void;
  onAdd: () => void;
}

export const ManualAddModal = ({
  isOpen,
  onClose,
  selectedMealType,
  selectedRecipeId,
  modalServings,
  recipes,
  onRecipeChange,
  onServingsChange,
  onAdd,
}: ManualAddModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add to ${selectedMealType}`}
    >
      <div className="space-y-6 py-4">
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
            <Utensils size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Selected Meal
            </p>
            <p className="text-sm font-bold text-indigo-900">
              {selectedMealType}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Recipe</label>
            <select
              value={selectedRecipeId}
              onChange={(e) => onRecipeChange(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-sm"
            >
              <option value="">Select a recipe...</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.nutrition.calories} kcal)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Servings</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                value={modalServings}
                onChange={(e) => onServingsChange(parseInt(e.target.value))}
                className="flex-1 accent-indigo-600 h-2 bg-gray-100 rounded-full appearance-none"
              />
              <span className="w-12 text-center font-black text-xl text-indigo-600">
                {modalServings}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-12 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={onAdd}
            disabled={!selectedRecipeId}
            className="flex-1 rounded-xl h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 disabled:shadow-none disabled:bg-gray-100 disabled:text-gray-400"
          >
            Add Meal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
