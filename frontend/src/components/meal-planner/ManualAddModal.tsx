import React, { useEffect } from "react";
import { Utensils } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Recipe, addMealSchema, AddMealData } from "@recipe-planner/shared";
import { useAppForm } from "../../hooks/useAppForm";

interface ManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMealType: string;
  recipes: Recipe[];
  onAdd: (data: AddMealData) => void;
}

export const ManualAddModal = ({
  isOpen,
  onClose,
  selectedMealType,
  recipes,
  onAdd,
}: ManualAddModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useAppForm({
    schema: addMealSchema,
    defaultValues: {
      recipeId: "",
      servings: 1,
    },
  });

  const servings = watch("servings");

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add to ${selectedMealType}`}
    >
      <form onSubmit={handleSubmit(onAdd)} className="space-y-6 py-4">
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
              {...register("recipeId")}
              className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-sm ${
                errors.recipeId ? "border-rose-500" : "border-gray-200"
              }`}
            >
              <option value="">Select a recipe...</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.nutrition.calories} kcal)
                </option>
              ))}
            </select>
            {errors.recipeId && (
              <p className="text-xs text-rose-500 font-bold">
                {errors.recipeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Servings</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                {...register("servings", { valueAsNumber: true })}
                className="flex-1 accent-indigo-600 h-2 bg-gray-100 rounded-full appearance-none"
              />
              <span className="w-12 text-center font-black text-xl text-indigo-600">
                {servings}
              </span>
            </div>
            {errors.servings && (
              <p className="text-xs text-rose-500 font-bold">
                {errors.servings.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-12 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-xl h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
          >
            Add Meal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
