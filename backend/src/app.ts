import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import passport from "./config/passport.js";
import routes from "./routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import mongoSanitize from "express-mongo-sanitize";
import { globalLimiter } from "./shared/middleware/rateLimit.js";
import { metricsMiddleware } from "./shared/middleware/metrics.js";

const app = express();

app.use(metricsMiddleware);
app.use(helmet());
app.use(mongoSanitize());
app.use(globalLimiter);
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
