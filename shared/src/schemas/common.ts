import { z } from "zod";

export const dateRangeQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const recipeFilterQuerySchema = z.object({
  dietaryTags: z.union([z.string(), z.array(z.string())]).optional(),
  createdBy: z.string().optional(),
  search: z.string().optional(),
});

export const scaleRecipeQuerySchema = z.object({
  servings: z.string().regex(/^\d+$/).transform(Number),
});

export const uuidSchema = z.string().uuid("Invalid ID format");

export const unitSchema = z.enum([
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
  "piece",
  "slice",
  "clove",
  "whole",
  "pinch",
  "dash",
  "to taste",
  "unit",
  "each",
  "can",
  "box",
  "bottle",
  "pkg",
  "packet",
  "bag",
  "head",
  "bunch",
  "sprig",
  "leaf",
  "gallon",
  "quart",
  "pint",
  "fl oz",
]);
