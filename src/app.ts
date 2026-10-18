import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRoutes } from "./routes/authRoutes";
import { usuarioRoutes } from "./routes/usuarioRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(morgan("dev"));
  app.use(express.json());

  app.use("/api/auth", authRoutes());
  app.use("/api/usuarios", usuarioRoutes());

  app.use(errorHandler);

  return app;
}
