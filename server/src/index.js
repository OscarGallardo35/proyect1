import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";
import { seedData } from "./data/seed-data.js";
import { overwriteState, getDbPath } from "./data/persistence.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  logger.error("Unhandled error", err);
  res.status(500).json({ message: "Error interno", detail: err.message });
});

function bootstrap() {
  const shouldSeed = process.env.SEED === "true";
  if (shouldSeed) {
    overwriteState(seedData);
    logger.info("Base de datos en memoria inicializada en", getDbPath());
  }

  app.listen(config.port, config.host, () => {
    logger.info(`API escuchando en http://${config.host}:${config.port}`);
  });
}

bootstrap();
