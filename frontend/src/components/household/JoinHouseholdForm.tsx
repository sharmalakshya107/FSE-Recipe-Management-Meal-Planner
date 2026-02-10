import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Spinner } from "../feedback/Spinner";
import { UseFormReturn } from "react-hook-form";
import { JoinHouseholdInput } from "@recipe-planner/shared";

interface JoinHouseholdFormProps {
  form: UseFormReturn<JoinHouseholdInput>;
  onSubmit: (data: JoinHouseholdInput) => void;
  isLoading: boolean;
}

export const JoinHouseholdForm = ({
  form,
  onSubmit,
  isLoading,
}: JoinHouseholdFormProps) => {
  return (
    <Card className="bg-white border-gray-100 shadow-sm rounded-2xl p-8">
      <h3 className="text-lg font-bold mb-4">Join Household</h3>
      <p className="text-sm text-gray-500 mb-6">
        Enter an invite code to join another household.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <input
          placeholder="INVITE-CODE"
          {...form.register("inviteCode")}
          onChange={(e) => {
            form.setValue("inviteCode", e.target.value.toUpperCase());
          }}
          className={`w-full p-3 bg-gray-50 border rounded-xl text-center font-mono text-lg font-bold outline-none focus:border-indigo-500 ${
            form.formState.errors.inviteCode
              ? "border-rose-500"
              : "border-gray-200"
          }`}
        />
        {form.formState.errors.inviteCode && (
          <p className="text-xs text-rose-500 font-medium text-center">
            {form.formState.errors.inviteCode.message}
          </p>
        )}
        <Button
          type="submit"
          className="btn-primary w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" className="text-white" /> : null}
          {isLoading ? "Joining..." : "Join Now"}
        </Button>
      </form>
    </Card>
  );
};
