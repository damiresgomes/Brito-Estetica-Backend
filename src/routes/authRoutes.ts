import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { UsuarioRepository } from "../repositories/usuarioRepository";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  const usuarioRepository = new UsuarioRepository();
  const authService = new AuthService(usuarioRepository);
  const authController = new AuthController(authService);

  app.post("/login", (request, reply) => authController.login(request, reply));
}
