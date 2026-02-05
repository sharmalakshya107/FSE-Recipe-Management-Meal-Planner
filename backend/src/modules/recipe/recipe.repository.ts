import { Recipe } from "@recipe-planner/shared";
import { RecipeModel } from "./recipe.model.js";

interface RecipeFilters {
  search?: string;
  tags?: string[];
  maxTime?: number;
  createdBy?: string | string[];
}

export const recipeRepository = {
  findAll: async (
    filters: RecipeFilters = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Recipe[]; total: number }> => {
    const query: Record<string, unknown> = {};

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.tags && filters.tags.length > 0) {
      query.dietaryTags = { $in: filters.tags };
    }

    if (filters.maxTime) {
      query.$expr = {
        $lte: [{ $add: ["$prepTime", "$cookTime"] }, filters.maxTime],
      };
    }

    if (filters.createdBy) {
      query.createdBy = Array.isArray(filters.createdBy)
        ? { $in: filters.createdBy }
        : filters.createdBy;
    }

    const [recipes, total] = await Promise.all([
      RecipeModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      RecipeModel.countDocuments(query),
    ]);

    return {
      data: recipes.map(mapDocToRecipe),
      total,
    };
  },

  findById: async (id: string): Promise<Recipe | undefined> => {
    const recipe = await RecipeModel.findOne({ _id: id }).lean();
    if (!recipe) return undefined;
    return mapDocToRecipe(recipe);
  },

  findByIds: async (ids: string[]): Promise<Recipe[]> => {
    const recipes = await RecipeModel.find({ _id: { $in: ids } }).lean();
    return recipes.map(mapDocToRecipe);
  },

  findByShareId: async (shareId: string): Promise<Recipe | undefined> => {
    const recipe = await RecipeModel.findOne({ shareId }).lean();
    if (!recipe) return undefined;
    return mapDocToRecipe(recipe);
  },

  create: async (recipe: Recipe): Promise<Recipe> => {
    const docToSave = {
      ...recipe,
      _id: recipe.id,
    };
    await RecipeModel.create(docToSave);
    return recipe;
  },

  update: async (
    id: string,
    updates: Partial<Recipe>,
  ): Promise<Recipe | undefined> => {
    const updated = await RecipeModel.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { new: true },
    ).lean();

    if (!updated) return undefined;
    return mapDocToRecipe(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await RecipeModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  save: async (recipe: Recipe): Promise<Recipe> => {
    const exists = await RecipeModel.exists({ _id: recipe.id });
    const docToSave = { ...recipe, _id: recipe.id };

    if (exists) {
      await RecipeModel.updateOne({ _id: recipe.id }, docToSave);
    } else {
      await RecipeModel.create(docToSave);
    }
    return recipe;
  },
};

const mapDocToRecipe = (doc: unknown): Recipe => {
  const { _id, __v, ...rest } = doc as Record<string, unknown>;
  return {
    id: (_id as string).toString(),
    ...(rest as unknown as Omit<Recipe, "id">),
  } as Recipe;
};
