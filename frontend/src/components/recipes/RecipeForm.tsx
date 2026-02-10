import React from "react";
import { useUploadImageMutation } from "../../services/api/uploadApi";
import { useToast } from "../feedback/Toast";
import { RecipeFormData, recipeSchema } from "@recipe-planner/shared";
import { useAppForm } from "../../hooks/useAppForm";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { RecipeBasicInfo } from "./form/RecipeBasicInfo";
import { IngredientForm } from "./form/IngredientForm";
import { InstructionForm } from "./form/InstructionForm";
import { RecipeDietaryInfo } from "./form/RecipeDietaryInfo";
import { NutritionOverview } from "./form/NutritionOverview";
import { Save, X } from "lucide-react";
import { useRecipes } from "../../hooks/useRecipes";

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel: string;
}

export const RecipeForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}: RecipeFormProps) => {
  const { calculateNutrition, isCalculatingNutrition } = useRecipes();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useAppForm({
    schema: recipeSchema,
    defaultValues: {
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
      ...initialData,
    },
  });

  const formData = watch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file).unwrap();
      setValue("imageUrl", result.url);
      addToast("Image uploaded successfully", "success");
    } catch (err) {
      addToast("Failed to upload image", "error");
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

      setValue("nutrition", result);
      addToast("Nutrition calculated!", "success");
    } catch (err) {
      addToast("Failed to calculate nutrition", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
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
        onChange={(updates) => {
          Object.entries(updates).forEach(([key, value]) => {
            setValue(key as keyof RecipeFormData, value);
          });
        }}
        onImageUpload={handleFileChange}
        errors={{
          title: errors.title?.message,
          description: errors.description?.message,
        }}
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Prep Time (mins)"
          type="number"
          error={errors.prepTime?.message}
          {...register("prepTime", { valueAsNumber: true })}
        />
        <Input
          label="Cook Time (mins)"
          type="number"
          error={errors.cookTime?.message}
          {...register("cookTime", { valueAsNumber: true })}
        />
        <Input
          label="Servings"
          type="number"
          error={errors.servings?.message}
          {...register("servings", { valueAsNumber: true })}
        />
      </div>

      <RecipeDietaryInfo
        selectedTags={formData.dietaryTags || []}
        onChange={(tags) => setValue("dietaryTags", tags)}
      />

      <IngredientForm
        ingredients={formData.ingredients || []}
        onChange={(ingredients) => setValue("ingredients", ingredients)}
        error={errors.ingredients?.message}
      />

      <InstructionForm
        instructions={formData.instructions || []}
        onChange={(instructions) => setValue("instructions", instructions)}
        error={errors.instructions?.message}
      />

      <div className="flex gap-3 pt-6">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onCancel}
          type="button"
        >
          <X size={18} className="mr-2" />
          Cancel
        </Button>
        <Button
          className="flex-1 h-12 rounded-xl"
          isLoading={isLoading}
          type="submit"
        >
          <Save size={18} className="mr-2" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
