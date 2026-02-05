export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  NODE_ENV: import.meta.env.MODE,
} as const;
