import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useRecipes } from "../../hooks/useRecipes";
import { Link2, Loader } from "lucide-react";
import { useToast } from "../feedback/Toast";
import { useAppForm } from "../../hooks/useAppForm";
import { importRecipeSchema, ImportRecipeData } from "@recipe-planner/shared";

interface ImportRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportRecipeModal = ({
  isOpen,
  onClose,
}: ImportRecipeModalProps) => {
  const { importRecipe, isImporting } = useRecipes();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm({
    schema: importRecipeSchema,
    defaultValues: {
      url: "",
    },
  });

  const handleImport = async (data: ImportRecipeData) => {
    try {
      await importRecipe(data).unwrap();
      addToast("Recipe imported successfully!", "success");
      reset();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      addToast(
        error?.data?.message ||
          "Failed to import recipe. Please check the URL.",
        "error",
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Recipe from URL"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 rounded-xl h-10"
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 btn-primary h-10 rounded-xl"
            onClick={handleSubmit(handleImport)}
            isLoading={isImporting}
            disabled={isImporting}
          >
            {isImporting ? "Importing..." : "Import Recipe"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
              <Link2 size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                How it works
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Paste a URL from popular recipe websites. We'll automatically
                extract the recipe details including ingredients, instructions,
                and cooking times.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Recipe URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Link2 size={16} />
            </div>
            <input
              type="url"
              placeholder="https://example.com/recipe"
              {...register("url")}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none transition-all ${
                errors.url
                  ? "border-rose-500"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
              disabled={isImporting}
            />
          </div>
          {errors.url && (
            <p className="text-xs text-rose-500 ml-1">{errors.url.message}</p>
          )}
          <p className="text-xs text-gray-500 ml-1 mt-1">
            Supports most popular recipe websites
          </p>
        </div>

        {isImporting && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
            <Loader size={18} className="text-indigo-600 animate-spin" />
            <p className="text-sm text-gray-600">
              Fetching recipe details from URL...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
