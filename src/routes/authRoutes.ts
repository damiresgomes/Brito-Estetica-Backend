import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { UsuarioRepository } from "../repositories/usuarioRepository";
import { authMiddleware } from "../middlewares/authMiddleware";

export function authRoutes(): Router {
  const router = Router();

  const usuarioRepository = new UsuarioRepository();
  const authService = new AuthService(usuarioRepository);
  const authController = new AuthController(authService);

  router.post("/login", (request, response) =>
    authController.login(request, response)
  );

  router.get("/me", authMiddleware, (request, response) =>
    authController.me(request, response)
  );

  return router;
}
