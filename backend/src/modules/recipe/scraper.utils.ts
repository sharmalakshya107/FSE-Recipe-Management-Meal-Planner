import axios from "axios";
import * as cheerio from "cheerio";
import { CreateRecipeInput } from "@recipe-planner/shared";
import { v4 as uuidv4 } from "uuid";

export const scrapeRecipe = async (
  url: string,
): Promise<Partial<CreateRecipeInput>> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RecipePlannerBot/1.0)",
      },
    });
    const $ = cheerio.load(data);

    const jsonLd = $('script[type="application/ld+json"]');
    let recipeData: Record<string, unknown> | null = null;

    jsonLd.each((_, elem) => {
      try {
        const content = $(elem).html();
        if (!content) return;
        const json = JSON.parse(content);

        const graph = json["@graph"] || (Array.isArray(json) ? json : [json]);
        const found = graph.find(
          (item: Record<string, unknown>) =>
            item["@type"] === "Recipe" ||
            (item["@type"] as string | string[])?.includes("Recipe"),
        );

        if (found) {
          recipeData = found;
          return false;
        }
      } catch (e) {}
    });

    if (recipeData) {
      return await parseSchemaOrgRecipe(recipeData, url);
    }

    return parseMetaTags($, url);
  } catch (error) {
    console.error("Scraping failed:", error);
    throw new Error("Failed to scrape recipe from URL");
  }
};

const parseSchemaOrgRecipe = async (
  data: Record<string, unknown>,
  url: string,
): Promise<Partial<CreateRecipeInput>> => {
  const ingredients = Array.isArray(data.recipeIngredient)
    ? (data.recipeIngredient as string[])
        .map((ing: string) => parseIngredientString(ing))
        .filter(
          (ing): ing is import("@recipe-planner/shared").Ingredient =>
            ing !== null,
        )
    : [];

  let nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  if (data.nutrition) {
    const n = data.nutrition as Record<string, string>;
    nutrition = {
      calories: parseInt(n.calories) || 0,
      protein: parseInt(n.proteinContent) || 0,
      carbs: parseInt(n.carbohydrateContent) || 0,
      fat: parseInt(n.fatContent) || 0,
      fiber: parseInt(n.fiberContent) || 0,
    };
  }

  const hasNutrition = nutrition.calories > 0 || nutrition.protein > 0;
  if (!hasNutrition && ingredients.length > 0) {
    try {
      const { nutritionService } = await import("./nutrition.service.js");
      const servings = parseInt(data.recipeYield as string) || 4;
      nutrition = await nutritionService.calculateNutrition(
        ingredients,
        servings,
      );
    } catch (error) {}
  }

  return {
    title: (data.name as string)?.trim() || "Untitled Recipe",
    description: (data.description as string)?.trim() || "",
    ingredients,
    instructions: parseInstructions(data.recipeInstructions),
    prepTime: parseDuration(data.prepTime as string),
    cookTime: parseDuration(data.cookTime as string),
    servings: parseInt(data.recipeYield as string) || 4,
    sourceUrl: url,
    imageUrl: Array.isArray(data.image)
      ? (data.image[0] as string)
      : (data.image as { url?: string })?.url || (data.image as string),
    dietaryTags: [],
    nutrition,
  };
};

const parseMetaTags = (
  $: cheerio.CheerioAPI,
  url: string,
): Partial<CreateRecipeInput> => {
  return {
    title: (
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Untitled Recipe"
    ).trim(),
    description: (
      $('meta[property="og:description"]').attr("content") || ""
    ).trim(),
    sourceUrl: url,
    imageUrl: $('meta[property="og:image"]').attr("content"),
    ingredients: [],
    instructions: [],
    prepTime: 0,
    cookTime: 0,
    servings: 4,
    dietaryTags: [],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
  };
};

const parseIngredientString = (str: string) => {
  if (!str || !str.trim()) return null;
  let cleaned = str.trim();

  const pattern =
    /^([\d\u00BC-\u00BE\u2150-\u215E\/\.\-\s]+)\s*([a-zA-Z]+)?\s*([^(]+)(?:\s*\(.*\))?$/;
  const match = cleaned.match(pattern);

  if (match) {
    const amountStr = match[1].trim();
    const unitRaw = match[2]?.trim();
    let name = match[3]?.trim();

    if (!name) {
      name = unitRaw || "";
      if (!name) return null;
      const amount = parseAmount(amountStr);
      return {
        id: uuidv4(),
        name: name,
        amount: amount || 1,
        unit: "piece",
      };
    }

    const amount = parseAmount(amountStr);

    let unit = "piece";
    if (unitRaw) {
      unit = normalizeUnit(unitRaw);
    }

    if (unit === "piece" && name) {
      const nameWords = name.split(/\s+/);
      if (nameWords.length > 1) {
        const possibleUnit = normalizeUnit(nameWords[0]);
        if (possibleUnit !== "piece") {
          unit = possibleUnit;
          name = nameWords.slice(1).join(" ");
        }
      }
    }

    let cleanName = name.replace(/^of\s+/i, "").trim();

    if (cleanName.length < 2) return null;

    return {
      id: uuidv4(),
      name: cleanName,
      amount: amount || 1,
      unit: unit,
    };
  }

  const simpleMatch = cleaned.match(/^([a-zA-Z\s]+)(?:\s*\(.*\))?$/);
  if (simpleMatch) {
    const name = simpleMatch[1].trim();
    if (name) {
      return {
        id: uuidv4(),
        name,
        amount: 1,
        unit: "to taste",
      };
    }
  }

  const fallbackName = cleaned.replace(/\s*\(.*\)$/, "").trim() || cleaned;
  if (!fallbackName) return null;

  return {
    id: uuidv4(),
    name: fallbackName,
    amount: 1,
    unit: "piece",
  };
};

const parseAmount = (str: string): number => {
  str = str.replace(/\s+/g, " ").trim();

  const unicodeFractions: Record<string, number> = {
    "¼": 0.25,
    "½": 0.5,
    "¾": 0.75,
    "⅓": 0.333333,
    "⅔": 0.666667,
    "⅕": 0.2,
    "⅖": 0.4,
    "⅗": 0.6,
    "⅘": 0.8,
    "⅙": 0.166667,
    "⅚": 0.833333,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875,
  };

  for (const [char, value] of Object.entries(unicodeFractions)) {
    if (str.includes(char)) {
      const parts = str.split(char);
      const whole = parts[0].trim() ? parseFloat(parts[0]) : 0;
      return whole + value;
    }
  }

  if (str.includes("-")) {
    const [start, end] = str.split("-").map((s) => parseAmount(s.trim()));
    return (start + end) / 2;
  }

  if (str.includes("/")) {
    const parts = str.split(" ");
    let total = 0;

    for (const part of parts) {
      if (part.includes("/")) {
        const [num, den] = part.split("/");
        total += parseInt(num) / parseInt(den);
      } else if (part) {
        total += parseFloat(part);
      }
    }

    return total || 1;
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 1 : parsed;
};

const normalizeUnit = (unit: string): string => {
  const normalized = unit.toLowerCase().replace(/s$/, "");

  const unitMap: Record<string, string> = {
    g: "g",
    gram: "g",
    gm: "g",
    kg: "kg",
    kilogram: "kg",
    oz: "oz",
    ounce: "oz",
    lb: "lb",
    pound: "lb",
    ml: "ml",
    milliliter: "ml",
    l: "l",
    liter: "l",
    cup: "cup",
    tbsp: "tbsp",
    tablespoon: "tbsp",
    tsp: "tsp",
    teaspoon: "tsp",
    piece: "piece",
    pc: "piece",
    pcs: "piece",
    slice: "slice",
    clove: "clove",
    whole: "whole",
    pinch: "pinch",
    dash: "dash",
  };

  return unitMap[normalized] || "piece";
};

const parseDuration = (duration: string | number | undefined): number => {
  if (!duration) return 0;

  if (typeof duration === "number") return duration;

  const isoMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (isoMatch) {
    const hours = isoMatch[1] ? parseInt(isoMatch[1]) : 0;
    const minutes = isoMatch[2] ? parseInt(isoMatch[2]) : 0;
    return hours * 60 + minutes;
  }

  const textMatch = duration.match(
    /(?:(\d+)\s*(?:hour|hr|h))?(?:\s*(\d+)\s*(?:minute|min|m))?/i,
  );
  if (textMatch) {
    const hours = textMatch[1] ? parseInt(textMatch[1]) : 0;
    const minutes = textMatch[2] ? parseInt(textMatch[2]) : 0;
    if (hours > 0 || minutes > 0) {
      return hours * 60 + minutes;
    }
  }

  const num = parseInt(duration);
  if (!isNaN(num)) return num;

  return 0;
};

const parseInstructions = (
  instructions: unknown,
): { step: number; text: string }[] => {
  if (typeof instructions === "string") {
    return [{ step: 1, text: instructions }];
  }

  if (Array.isArray(instructions)) {
    const steps: { step: number; text: string }[] = [];
    let stepNumber = 1;

    for (const inst of instructions) {
      if (typeof inst === "string" && inst.trim()) {
        steps.push({ step: stepNumber++, text: inst.trim() });
        continue;
      }

      if (inst && typeof inst === "object") {
        if (typeof inst.text === "string" && inst.text.trim()) {
          steps.push({ step: stepNumber++, text: inst.text.trim() });
          continue;
        }

        if (inst["@type"] === "HowToSection" && inst.itemListElement) {
          const sectionSteps = parseInstructions(inst.itemListElement);
          steps.push(
            ...sectionSteps.map((s) => ({ ...s, step: stepNumber++ })),
          );
          continue;
        }

        if (inst.itemListElement && Array.isArray(inst.itemListElement)) {
          const nestedSteps = parseInstructions(inst.itemListElement);
          steps.push(...nestedSteps.map((s) => ({ ...s, step: stepNumber++ })));
          continue;
        }
      }
    }

    return steps;
  }

  if (instructions && typeof instructions === "object") {
    const inst = instructions as Record<string, unknown>;
    if (typeof inst.text === "string" && inst.text.trim()) {
      return [{ step: 1, text: inst.text.trim() }];
    }
    if (inst.itemListElement) {
      return parseInstructions(inst.itemListElement);
    }
  }

  return [];
};
