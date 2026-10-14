import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { authRoutes } from "./routes/authRoutes";
import { usuarioRoutes } from "./routes/usuarioRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(helmet);
  app.setErrorHandler(errorHandler);

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(usuarioRoutes, { prefix: "/api/usuarios" });

  return app;
}
