import mongoose, { Schema } from "mongoose";
import { InventoryItem } from "@recipe-planner/shared";

const inventorySchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, ref: "User", index: true },
    householdId: { type: String, ref: "Household", index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
    expiryDate: { type: String, index: true },
    category: { type: String, index: true },
  },
  {
    timestamps: true,
    _id: false,
  },
);

inventorySchema.virtual("id").get(function () {
  return this._id;
});

inventorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    delete ret._id;
  },
});

export const InventoryModel = mongoose.model<InventoryItem>(
  "Inventory",
  inventorySchema,
);
