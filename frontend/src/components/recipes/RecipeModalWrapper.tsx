import React from "react";
import { Modal } from "../ui/Modal";
import { RecipeForm } from "./RecipeForm";
import { Recipe, RecipeFormData } from "@recipe-planner/shared";
import { useToast } from "../feedback/Toast";

interface RecipeModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  initialData?: Recipe | null;
  isLoading: boolean;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  successMessage: string;
}

export const RecipeModalWrapper = ({
  isOpen,
  onClose,
  title,
  submitLabel,
  initialData,
  isLoading,
  onSubmit,
  successMessage,
}: RecipeModalWrapperProps) => {
  const { addToast } = useToast();

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      await onSubmit(data);
      addToast(successMessage, "success");
      onClose();
    } catch (err) {
      addToast(
        (err as { data?: { message?: string } })?.data?.message ||
          "An error occurred",
        "error",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <RecipeForm
        initialData={initialData || undefined}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        submitLabel={submitLabel}
      />
    </Modal>
  );
};
