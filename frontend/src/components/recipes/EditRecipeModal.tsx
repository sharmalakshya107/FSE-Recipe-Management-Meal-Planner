import React from "react";
import { useRecipes } from "../../hooks/useRecipes";
import { Recipe, RecipeFormData } from "@recipe-planner/shared";
import { RecipeModalWrapper } from "./RecipeModalWrapper";

interface EditRecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditRecipeModal = ({
  recipe,
  isOpen,
  onClose,
}: EditRecipeModalProps) => {
  const { updateRecipe, isUpdating } = useRecipes();

  const handleSubmit = async (data: RecipeFormData) => {
    if (!recipe) return;
    await updateRecipe({ id: recipe.id, data }).unwrap();
  };

  return (
    <RecipeModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Recipe"
      submitLabel="Save Changes"
      initialData={recipe}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      successMessage="Recipe updated successfully!"
    />
  );
};
