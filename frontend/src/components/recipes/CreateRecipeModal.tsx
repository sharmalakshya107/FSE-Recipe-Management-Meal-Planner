import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useRecipes } from "../../hooks/useRecipes";
import { RecipeFormData } from "@recipe-planner/shared";
import { useToast } from "../feedback/Toast";
import { useUploadImageMutation } from "../../services/api/uploadApi";
import { RecipeBasicInfo } from "./form/RecipeBasicInfo";
import { IngredientForm } from "./form/IngredientForm";
import { InstructionForm } from "./form/InstructionForm";
import { RecipeDietaryInfo } from "./form/RecipeDietaryInfo";
import { NutritionOverview } from "./form/NutritionOverview";

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRecipeModal = ({
  isOpen,
  onClose,
}: CreateRecipeModalProps) => {
  const {
    createRecipe,
    isCreating,
    calculateNutrition,
    isCalculatingNutrition,
  } = useRecipes();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { addToast } = useToast();

  const initialFormState: Partial<RecipeFormData> = {
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    dietaryTags: [],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
  };

  const [formData, setFormData] =
    useState<Partial<RecipeFormData>>(initialFormState);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file).unwrap();
      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      addToast("Image uploaded successfully", "success");
    } catch (err) {
      addToast("Failed to upload image", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.ingredients?.length || !formData.instructions?.length) {
        addToast("Please add at least one ingredient and instruction", "error");
        return;
      }
      await createRecipe(formData as RecipeFormData).unwrap();
      addToast("Recipe created successfully!", "success");
      setFormData(initialFormState);
      onClose();
    } catch (err) {
      addToast(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to create recipe",
        "error",
      );
    }
  };

  const handleCalculate = async () => {
    if (!formData.ingredients?.length) {
      addToast("Add some ingredients first!", "error");
      return;
    }

    try {
      const result = await calculateNutrition({
        ingredients: formData.ingredients,
        servings: formData.servings || 1,
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        nutrition: result,
      }));
      addToast("Nutrition calculated!", "success");
    } catch (err) {
      addToast("Failed to calculate nutrition", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Recipe" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <NutritionOverview
          nutrition={formData.nutrition!}
          onCalculate={handleCalculate}
          isCalculating={isCalculatingNutrition}
        />

        <RecipeBasicInfo
          title={formData.title || ""}
          description={formData.description || ""}
          imageUrl={formData.imageUrl}
          isUploading={isUploading}
          onChange={(updates) =>
            setFormData((prev) => ({ ...prev, ...updates }))
          }
          onImageUpload={handleFileChange}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Prep Time (mins)"
            type="number"
            value={formData.prepTime}
            onChange={(e) =>
              setFormData({ ...formData, prepTime: parseInt(e.target.value) })
            }
          />
          <Input
            label="Cook Time (mins)"
            type="number"
            value={formData.cookTime}
            onChange={(e) =>
              setFormData({ ...formData, cookTime: parseInt(e.target.value) })
            }
          />
          <Input
            label="Servings"
            type="number"
            value={formData.servings}
            onChange={(e) =>
              setFormData({ ...formData, servings: parseInt(e.target.value) })
            }
          />
        </div>

        <RecipeDietaryInfo
          selectedTags={formData.dietaryTags || []}
          onChange={(tags) => setFormData({ ...formData, dietaryTags: tags })}
        />

        <IngredientForm
          ingredients={formData.ingredients || []}
          onChange={(ingredients) => setFormData({ ...formData, ingredients })}
        />

        <InstructionForm
          instructions={formData.instructions || []}
          onChange={(instructions) =>
            setFormData({ ...formData, instructions })
          }
        />

        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl"
            isLoading={isCreating}
            type="submit"
          >
            Create Recipe
          </Button>
        </div>
      </form>
    </Modal>
  );
};
