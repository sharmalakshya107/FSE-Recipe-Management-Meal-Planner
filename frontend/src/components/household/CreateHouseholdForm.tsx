import React from "react";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Spinner } from "../feedback/Spinner";
import { UseFormReturn } from "react-hook-form";
import { CreateHouseholdInput } from "@recipe-planner/shared";

interface CreateHouseholdFormProps {
  form: UseFormReturn<CreateHouseholdInput>;
  onSubmit: (data: CreateHouseholdInput) => void;
  isLoading: boolean;
}

export const CreateHouseholdForm = ({
  form,
  onSubmit,
  isLoading,
}: CreateHouseholdFormProps) => {
  return (
    <Card className="border-indigo-100 shadow-sm rounded-2xl overflow-hidden bg-indigo-50/30">
      <CardHeader className="px-6 py-4 border-b border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900">Create Household</h3>
      </CardHeader>
      <CardContent className="p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <p className="text-sm font-medium text-gray-600 mb-2">
            Create a new household to collaborate with others.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Household Name (e.g. Smith Family)"
                {...form.register("name")}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  form.formState.errors.name
                    ? "border-rose-500"
                    : "border-gray-200"
                }`}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl h-10 px-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
            >
              {isLoading ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <Plus size={16} />
              )}
              <span>Create</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
