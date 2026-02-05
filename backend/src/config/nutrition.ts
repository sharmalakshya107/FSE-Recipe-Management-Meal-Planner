import { config } from "./index.js";

export const nutritionConfig = {
  usda: {
    apiKey: config.USDA_API_KEY,
    baseUrl: config.USDA_API_URL,
    timeout: 5000,
    enabled: true,
  },
};
