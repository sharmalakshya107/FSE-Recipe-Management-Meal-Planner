import React, { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/feedback/Toast";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@recipe-planner/shared";
import { useAppForm } from "../../hooks/useAppForm";
import { z } from "zod";

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm({
    schema: changePasswordSchema
      .extend({
        confirmPassword: z.string().min(1, "Please confirm your password"),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match",
        path: ["confirmPassword"],
      }),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast("Password changed successfully", "success");
      onClose();
      reset();
    } catch (err) {
      addToast("Failed to change password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            {...register("currentPassword")}
            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
              errors.currentPassword
                ? "border-rose-300 focus:border-rose-500"
                : "border-gray-200 focus:border-indigo-500"
            }`}
            placeholder="Enter current password"
          />
          {errors.currentPassword && (
            <p className="text-xs text-rose-500 font-bold">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword")}
            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
              errors.newPassword
                ? "border-rose-300 focus:border-rose-500"
                : "border-gray-200 focus:border-indigo-500"
            }`}
            placeholder="Enter new password"
          />
          {errors.newPassword && (
            <p className="text-xs text-rose-500 font-bold">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
              errors.confirmPassword
                ? "border-rose-300 focus:border-rose-500"
                : "border-gray-200 focus:border-indigo-500"
            }`}
            placeholder="Retype new password"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 font-bold">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-11 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-xl h-11 font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
