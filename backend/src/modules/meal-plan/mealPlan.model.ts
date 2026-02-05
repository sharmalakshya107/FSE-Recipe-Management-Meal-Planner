import mongoose, { Schema } from "mongoose";
import { MealPlan, DayPlan, MealSlot } from "@recipe-planner/shared";

const mealSlotSchema = new Schema(
  {
    id: { type: String, required: true },
    recipeId: { type: String, required: true, ref: "Recipe" },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    servings: { type: Number, required: true },
    isCooked: { type: Boolean, default: false },
  },
  { _id: false },
);

const dayPlanSchema = new Schema(
  {
    date: { type: String, required: true },
    dayOfWeek: { type: String, required: true },
    slots: [mealSlotSchema],
  },
  { _id: false },
);

const mealPlanSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, ref: "User", index: true },
    householdId: { type: String, ref: "Household", index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: [dayPlanSchema],
  },
  {
    timestamps: true,
    _id: false,
  },
);

mealPlanSchema.index({ userId: 1, startDate: 1 });

mealPlanSchema.virtual("id").get(function () {
  return this._id;
});

mealPlanSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    delete ret._id;
  },
});

export const MealPlanModel = mongoose.model<MealPlan>(
  "MealPlan",
  mealPlanSchema,
);
