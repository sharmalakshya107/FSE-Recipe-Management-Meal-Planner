import { z } from "zod";

const unitEnum = z.enum([
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
]);

export const createInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  unit: unitEnum,
  expiryDate: z.string().optional(),
  category: z.string().optional(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial();
