import {
  Recipe,
  DayPlan,
  Ingredient,
  InventoryItem,
  ShoppingListItem,
} from "@recipe-planner/shared";
import { v4 as uuidv4 } from "uuid";
import { convertUnit } from "../../shared/utils/units.js";

export const generateShoppingList = (
  days: DayPlan[],
  recipes: Recipe[],
  inventory: InventoryItem[],
  userId: string,
): Record<string, ShoppingListItem[]> & { totalItems: number } => {
  const neededIngredients = new Map<string, { amount: number; unit: string }>();

  days.forEach((day) => {
    day.slots.forEach((slot) => {
      const recipe = recipes.find((r) => r.id === slot.recipeId);
      if (recipe) {
        const scaleFactor = slot.servings / recipe.servings;
        recipe.ingredients.forEach((ing) => {
          const key = `${ing.name.toLowerCase().trim()}_${ing.unit}`;
          const current = neededIngredients.get(key) || {
            amount: 0,
            unit: ing.unit,
          };
          neededIngredients.set(key, {
            amount: current.amount + ing.amount * scaleFactor,
            unit: ing.unit,
          });
        });
      }
    });
  });

  const shoppingList: Record<string, ShoppingListItem[] | number> = {
    Produce: [],
    Dairy: [],
    Pantry: [],
    Meat: [],
    Frozen: [],
    Spices: [],
    Other: [],
    totalItems: 0,
  };

  const getCategory = (name: string): string => {
    const n = name.toLowerCase();

    if (
      n.includes("salt") ||
      n.includes("pepper") ||
      n.includes("cinnamon") ||
      n.includes("oregano") ||
      n.includes("spice") ||
      n.includes("cumin") ||
      n.includes("ginger") ||
      n.includes("garlic powder") ||
      n.includes("turmeric") ||
      n.includes("chili") ||
      n.includes("clove") ||
      n.includes("cardamom") ||
      n.includes("paprika") ||
      n.includes("methi") ||
      n.includes("fenugreek") ||
      n.includes("mustard") ||
      n.includes("seeds") ||
      n.includes("powder") ||
      n.includes("masala")
    )
      return "Spices";

    if (
      n.includes("apple") ||
      n.includes("onion") ||
      n.includes("carrot") ||
      n.includes("lettuce") ||
      n.includes("tomato") ||
      n.includes("garlic") ||
      n.includes("fruit") ||
      n.includes("vegetable") ||
      n.includes("spinach") ||
      n.includes("broccoli") ||
      n.includes("mushroom") ||
      n.includes("potato") ||
      n.includes("lemon") ||
      n.includes("lime") ||
      n.includes("herb") ||
      n.includes("cilantro") ||
      n.includes("parsley") ||
      n.includes("basil") ||
      n.includes("mint") ||
      n.includes("ginger") ||
      n.includes("chili")
    )
      return "Produce";

    if (
      n.includes("chicken") ||
      n.includes("beef") ||
      n.includes("pork") ||
      n.includes("fish") ||
      n.includes("egg") ||
      n.includes("meat") ||
      n.includes("steak") ||
      n.includes("shrimp") ||
      n.includes("tofu") ||
      n.includes("paneer") ||
      n.includes("lamb") ||
      n.includes("turkey")
    )
      return "Meat";

    if (
      n.includes("milk") ||
      n.includes("cheese") ||
      n.includes("yogurt") ||
      n.includes("butter") ||
      n.includes("cream") ||
      n.includes("curd")
    )
      return "Dairy";

    if (
      n.includes("flour") ||
      n.includes("sugar") ||
      n.includes("oil") ||
      n.includes("pasta") ||
      n.includes("rice") ||
      n.includes("bread") ||
      n.includes("sauce") ||
      n.includes("vinegar") ||
      n.includes("honey") ||
      n.includes("syrup") ||
      n.includes("dal") ||
      n.includes("lentil") ||
      n.includes("pulses") ||
      n.includes("poha") ||
      n.includes("maida") ||
      n.includes("sooji") ||
      n.includes("besan") ||
      n.includes("beans") ||
      n.includes("chickpeas") ||
      n.includes("nuts") ||
      n.includes("seeds") ||
      n.includes("tamari") ||
      n.includes("soy") ||
      n.includes("broth") ||
      n.includes("stock") ||
      n.includes("baking")
    )
      return "Pantry";

    if (n.includes("frozen") || n.includes("ice cream") || n.includes("peas"))
      return "Frozen";

    return "Other";
  };

  const remainingInventory = inventory.map((item) => ({ ...item }));

  neededIngredients.forEach((needed, key) => {
    const [name] = key.split("_");

    const inStockItem = remainingInventory.find(
      (item) => item.name.toLowerCase() === name,
    );

    let buyAmount = 0;

    if (inStockItem) {
      if (inStockItem.unit === needed.unit) {
        if (inStockItem.amount >= needed.amount) {
          inStockItem.amount -= needed.amount;
        } else {
          buyAmount = needed.amount - inStockItem.amount;
          inStockItem.amount = 0;
        }
      } else {
        const neededInStockUnit = convertUnit(
          needed.amount,
          needed.unit as import("@recipe-planner/shared").Unit,
          inStockItem.unit as import("@recipe-planner/shared").Unit,
        );

        if (neededInStockUnit !== -1) {
          if (inStockItem.amount >= neededInStockUnit) {
            inStockItem.amount -= neededInStockUnit;
          } else {
            const stockInNeededUnit = convertUnit(
              inStockItem.amount,
              inStockItem.unit as import("@recipe-planner/shared").Unit,
              needed.unit as import("@recipe-planner/shared").Unit,
            );

            if (stockInNeededUnit !== -1) {
              buyAmount = needed.amount - stockInNeededUnit;
              inStockItem.amount = 0;
            } else {
              buyAmount = needed.amount;
            }
          }
        } else {
          buyAmount = needed.amount;
        }
      }
    } else {
      buyAmount = needed.amount;
    }

    if (buyAmount > 0) {
      const n = name!.toLowerCase();

      const skipList = [
        "water",
        "ice",
        "salt to taste",
        "pepper to taste",
        "to taste",
      ];
      if (
        skipList.some((skip) => n.includes(skip) && n.length < skip.length + 5)
      ) {
        return;
      }

      let finalName = name!
        .replace(
          /^\d+\s*(cup|tsp|tbsp|g|kg|ml|l|oz|lb|piece|slice|unit)s?\s+/i,
          "",
        )
        .trim();

      finalName = finalName.charAt(0).toUpperCase() + finalName.slice(1);

      const category = getCategory(finalName);
      const stableId = Buffer.from(`${key}_${category}_${userId}`).toString(
        "base64",
      );

      (shoppingList[category] as ShoppingListItem[]).push({
        id: stableId,
        userId,
        name: finalName,
        amount: Math.ceil(buyAmount * 100) / 100,
        unit: needed.unit as import("@recipe-planner/shared").Unit,
        isPurchased: false,
      });
      (shoppingList.totalItems as number)++;
    }
  });

  return shoppingList as Record<string, ShoppingListItem[]> & {
    totalItems: number;
  };
};
