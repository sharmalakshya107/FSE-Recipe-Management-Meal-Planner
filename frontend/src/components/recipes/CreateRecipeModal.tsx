import React from "react";
import { useRecipes } from "../../hooks/useRecipes";
import { RecipeFormData } from "@recipe-planner/shared";
import { RecipeModalWrapper } from "./RecipeModalWrapper";

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRecipeModal = ({
  isOpen,
  onClose,
}: CreateRecipeModalProps) => {
  const { createRecipe, isCreating } = useRecipes();

  const handleSubmit = async (data: RecipeFormData) => {
    await createRecipe(data).unwrap();
  };

  return (
    <RecipeModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Recipe"
      submitLabel="Create Recipe"
      isLoading={isCreating}
      onSubmit={handleSubmit}
      successMessage="Recipe created successfully!"
    />
  );
};
