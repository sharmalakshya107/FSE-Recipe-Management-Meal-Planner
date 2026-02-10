import { z } from "zod";
import { unitSchema } from "./common.js";
import { InventoryCategory } from "../types/common.js";

export const createInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  unit: unitSchema,
  expiryDate: z.string().optional(),
  category: z.nativeEnum(InventoryCategory).optional(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial();
export const addPurchasedItemsSchema = z.array(
  z.object({
    name: z.string().min(1),
    amount: z.number().min(0),
    unit: z.string().min(1),
  }),
);

export type CreateInventoryInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventoryItemSchema>;
export type AddPurchasedItemsInput = z.infer<typeof addPurchasedItemsSchema>;
