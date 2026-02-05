import mongoose, { Schema } from "mongoose";
import { Recipe } from "@recipe-planner/shared";

const ingredientSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false },
);

const instructionSchema = new Schema(
  {
    step: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const nutritionSchema = new Schema(
  {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
  },
  { _id: false },
);

const recipeSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    dietaryTags: { type: [String], index: true },
    nutrition: nutritionSchema,
    imageUrl: { type: String },
    sourceUrl: { type: String },
    shareId: { type: String, unique: true, sparse: true, index: true },
    createdBy: { type: String, required: true, ref: "User", index: true },
  },
  {
    timestamps: true,
    _id: false,
  },
);

recipeSchema.index({ title: "text", description: "text" });

recipeSchema.virtual("id").get(function () {
  return this._id;
});

recipeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id;
  },
});

export const RecipeModel = mongoose.model<Recipe>("Recipe", recipeSchema);
