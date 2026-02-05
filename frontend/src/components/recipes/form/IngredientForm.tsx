import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Ingredient, Unit } from "@recipe-planner/shared";

interface IngredientFormProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export const IngredientForm = ({
  ingredients,
  onChange,
}: IngredientFormProps) => {
  const [newIngredient, setNewIngredient] = useState<{
    name: string;
    amount: number;
    unit: string;
  }>({
    name: "",
    amount: 0,
    unit: "g",
  });

  const handleAdd = () => {
    if (!newIngredient.name || newIngredient.amount <= 0) return;
    onChange([
      ...(ingredients || []),
      { ...newIngredient, id: crypto.randomUUID() } as Ingredient,
    ]);
    setNewIngredient({ name: "", amount: 0, unit: "g" });
  };

  const handleRemove = (id: string, idx: number) => {
    onChange(ingredients.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-gray-900 border-b border-gray-100 block pb-2 uppercase tracking-wider">
        Ingredients
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ingredient name"
          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
          value={newIngredient.name}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, name: e.target.value })
          }
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          className="w-24 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
          value={newIngredient.amount || ""}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              amount: parseFloat(e.target.value),
            })
          }
        />
        <select
          className="w-28 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
          value={newIngredient.unit}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, unit: e.target.value })
          }
        >
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
          <option value="cup">cup</option>
          <option value="cups">cups</option>
          <option value="tbsp">tbsp</option>
          <option value="tsp">tsp</option>
          <option value="oz">oz</option>
          <option value="lb">lb</option>
          <option value="piece">piece</option>
          <option value="pieces">pieces</option>
          <option value="slice">slice</option>
          <option value="slices">slices</option>
          <option value="pinch">pinch</option>
          <option value="to taste">to taste</option>
        </select>
        <button
          type="button"
          onClick={handleAdd}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ingredients?.map((ing, idx) => (
          <span
            key={ing.id || idx}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
          >
            {ing.amount}
            {ing.unit} {ing.name}
            <button
              type="button"
              onClick={() => handleRemove(ing.id, idx)}
              className="text-gray-400 hover:text-rose-500"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
