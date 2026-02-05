import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Recipe } from "@recipe-planner/shared";
import {
  Clock,
  Users,
  Flame,
  Utensils,
  Info,
  Share2,
  Check,
  Pencil,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import { useToast } from "../feedback/Toast";
import {
  useShareRecipeMutation,
  useLazyScaleRecipeQuery,
} from "../../services/api/recipeApi";

interface RecipeDetailsModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeDetailsModal = ({
  recipe,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: RecipeDetailsModalProps) => {
  const { addToast } = useToast();
  const [shareRecipe] = useShareRecipeMutation();
  const [triggerScale, { isFetching: isScaling }] = useLazyScaleRecipeQuery();

  const [displayRecipe, setDisplayRecipe] = useState<Recipe | null>(recipe);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    setDisplayRecipe(recipe);
  }, [recipe, isOpen]);

  if (!displayRecipe) return null;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await shareRecipe(displayRecipe.id).unwrap();
      const shareUrl = `${window.location.origin}/recipes/share/${result.shareId}`;

      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      addToast("Share link copied to clipboard!", "success");

      setTimeout(() => setIsCopied(false), 3000);
    } catch (err: unknown) {
      addToast(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to generate share link",
        "error",
      );
    } finally {
      setIsSharing(false);
    }
  };

  const updateServings = async (newServings: number) => {
    if (newServings < 1 || newServings > 50) return;
    try {
      const scaled = await triggerScale({
        id: displayRecipe.id,
        servings: newServings,
      }).unwrap();
      setDisplayRecipe(scaled);
    } catch (err) {
      addToast("Failed to scale recipe", "error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={displayRecipe.title}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden">
          {displayRecipe.imageUrl ? (
            <img
              src={displayRecipe.imageUrl}
              alt={displayRecipe.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Utensils size={40} className="mx-auto text-gray-300 mb-2" />
                <span className="text-sm font-medium text-gray-400">
                  No Image
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {displayRecipe.description && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {displayRecipe.description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl text-center">
            <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-lg mb-2">
              <Clock size={20} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Time
            </p>
            <p className="text-lg font-bold text-gray-900">
              {displayRecipe.prepTime + displayRecipe.cookTime} min
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-2xl text-center relative overflow-hidden group">
            <div className="inline-flex p-2 bg-amber-50 text-amber-600 rounded-lg mb-2 group-hover:bg-amber-100 transition-colors">
              <Users size={20} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Servings
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => updateServings(displayRecipe.servings - 1)}
                disabled={displayRecipe.servings <= 1 || isScaling}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-black text-gray-900 min-w-[2ch]">
                {displayRecipe.servings}
              </span>
              <button
                onClick={() => updateServings(displayRecipe.servings + 1)}
                disabled={displayRecipe.servings >= 50 || isScaling}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-2xl text-center">
            <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-lg mb-2">
              <Flame size={20} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Calories
            </p>
            <p className="text-lg font-bold text-gray-900">
              {displayRecipe.nutrition.calories > 0
                ? `${displayRecipe.nutrition.calories} kcal`
                : "— kcal"}
            </p>
          </div>
        </div>

        {/* Nutritional Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
              Protein
            </p>
            <p className="text-sm font-black text-emerald-900">
              {displayRecipe.nutrition.protein}g
            </p>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
              Carbs
            </p>
            <p className="text-sm font-black text-amber-900">
              {displayRecipe.nutrition.carbs}g
            </p>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">
              Fat
            </p>
            <p className="text-sm font-black text-rose-900">
              {displayRecipe.nutrition.fat}g
            </p>
          </div>
          <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
              Fiber
            </p>
            <p className="text-sm font-black text-indigo-900">
              {displayRecipe.nutrition.fiber}g
            </p>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
              <Utensils size={18} className="text-indigo-600" />
              Ingredients
            </h3>
            <ul className="space-y-2">
              {displayRecipe.ingredients.map((ing, idx) => (
                <li
                  key={ing.id || idx}
                  className="flex items-start gap-2 text-sm text-gray-800 bg-white p-2.5 rounded-lg border border-gray-200"
                >
                  <span className="font-bold text-indigo-600 min-w-[70px] shrink-0">
                    {ing.amount} {ing.unit}
                  </span>
                  <span className="flex-1 leading-snug">{ing.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
              <Info size={18} className="text-indigo-600" />
              Instructions
            </h3>
            <div className="space-y-3">
              {displayRecipe.instructions.map((inst, idx) => (
                <div key={inst.step || idx} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {inst.step}
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed pt-0.5 max-w-md">
                    {inst.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-11 px-5 rounded-xl font-bold text-sm border-gray-200 hover:border-indigo-200"
              onClick={handleShare}
              isLoading={isSharing}
            >
              {isCopied ? (
                <>
                  <Check size={18} className="mr-2 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 size={18} className="mr-2 text-indigo-500" />
                  Share
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="h-11 px-5 rounded-xl font-bold text-sm border-gray-200 hover:border-amber-200 hover:bg-amber-50 group"
              onClick={() => onEdit(displayRecipe)}
            >
              <Pencil
                size={18}
                className="mr-2 text-amber-500 group-hover:scale-110 transition-transform"
              />
              Edit
            </Button>

            <Button
              variant="outline"
              className="h-11 px-5 rounded-xl font-bold text-sm border-gray-200 hover:border-rose-200 hover:bg-rose-50 group"
              onClick={() => onDelete(displayRecipe.id)}
            >
              <Trash2
                size={18}
                className="mr-2 text-rose-500 group-hover:scale-110 transition-transform"
              />
              Delete
            </Button>
          </div>

          <Button
            variant="outline"
            className="h-11 px-8 rounded-xl font-bold text-sm border-gray-200"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
