import mongoose, { Schema } from "mongoose";
import { Household } from "./household.repository.js";

const householdSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    adminId: { type: String, required: true, ref: "User" },
    memberIds: [{ type: String, ref: "User" }],
    inviteCode: { type: String, required: true },
    inviteCodeHash: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true,
    _id: false,
  },
);

householdSchema.virtual("id").get(function () {
  return this._id;
});

householdSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    delete ret._id;
  },
});

export const HouseholdModel = mongoose.model<Household>(
  "Household",
  householdSchema,
);
