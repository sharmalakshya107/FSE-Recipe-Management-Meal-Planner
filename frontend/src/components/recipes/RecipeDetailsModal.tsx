import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Recipe } from "@recipe-planner/shared";
import { Check, Share2, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../feedback/Toast";
import {
  useShareRecipeMutation,
  useLazyScaleRecipeQuery,
} from "../../services/api/recipeApi";
import { RecipeHeader } from "./details/RecipeHeader";
import { RecipeStats } from "./details/RecipeStats";
import { NutritionBreakdown } from "./details/NutritionBreakdown";
import { IngredientList } from "./details/IngredientList";
import { InstructionList } from "./details/InstructionList";

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
        <RecipeHeader
          imageUrl={displayRecipe.imageUrl}
          title={displayRecipe.title}
          description={displayRecipe.description}
        />

        <RecipeStats
          totalTime={displayRecipe.prepTime + displayRecipe.cookTime}
          servings={displayRecipe.servings}
          calories={displayRecipe.nutrition.calories}
          onUpdateServings={updateServings}
          isScaling={isScaling}
        />

        <NutritionBreakdown nutrition={displayRecipe.nutrition} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IngredientList ingredients={displayRecipe.ingredients} />
          <InstructionList instructions={displayRecipe.instructions} />
        </div>

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
