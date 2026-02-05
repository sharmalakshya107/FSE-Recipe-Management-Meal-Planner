import app from "./app.js";
import { config } from "./config/index.js";
import { connectDatabase } from "./config/db.js";

const PORT = config.PORT;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `🚀 [Server] Running in ${config.NODE_ENV} mode on port ${PORT}`,
    );
  });
};

startServer();

process.on("unhandledRejection", (reason) => {
  console.error("⛔ [UnhandledRejection]", reason);
});

process.on("uncaughtException", (error) => {
  console.error("⛔ [UncaughtException]", error);
  process.exit(1);
});
