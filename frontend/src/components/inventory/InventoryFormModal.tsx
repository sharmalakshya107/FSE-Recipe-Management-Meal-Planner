import React from "react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
  InventoryCategory,
  Unit,
  CreateInventoryInput,
} from "@recipe-planner/shared";
import { ChefHat, Calculator, Calendar } from "lucide-react";

const COMMON_UNITS: Unit[] = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "pcs",
  "oz",
  "lb",
];

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInventoryInput) => void;
  isEditing: boolean;
  isSubmitting: boolean;
  register: UseFormRegister<CreateInventoryInput>;
  handleSubmit: UseFormHandleSubmit<CreateInventoryInput>;
  errors: FieldErrors<CreateInventoryInput>;
}

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  isSubmitting,
  register,
  handleSubmit,
  errors,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Update Essentials" : "Add to Pantry"}
      size="md"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl font-bold border-gray-100"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            className="flex-1 btn-primary h-12 rounded-2xl font-black shadow-lg shadow-indigo-100"
          >
            {isEditing ? "Update Stock" : "Add Stock"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Ingredient Name
          </label>
          <div className="relative">
            <ChefHat
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              placeholder="e.g. Organic Milk"
              {...register("name")}
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-gray-300 ${
                errors.name
                  ? "border-rose-500"
                  : "border-transparent focus:bg-white focus:border-indigo-600/10"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-500 px-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Amount
            </label>
            <div className="relative">
              <Calculator
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="number"
                step="any"
                {...register("amount", { valueAsNumber: true })}
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl text-sm font-bold outline-none transition-all ${
                  errors.amount
                    ? "border-rose-500"
                    : "border-transparent focus:bg-white focus:border-indigo-600/10"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-500 px-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Measurement
            </label>
            <select
              {...register("unit")}
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all cursor-pointer"
            >
              {COMMON_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all cursor-pointer"
          >
            {Object.values(InventoryCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Expiry Warning
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              {...register("expiryDate")}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
