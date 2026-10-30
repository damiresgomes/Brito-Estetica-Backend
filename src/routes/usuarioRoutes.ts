import { Router } from "express";
import { cadastrarUsuarioController, listarUsuariosController, atualizarUsuarioController, buscarUsuarioPorIdController } from "../controllers/usuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

export function usuarioRoutes(): Router {
  const router = Router();

  router.post("/cadastro", cadastrarUsuarioController);
  router.get("/listar", authMiddleware, listarUsuariosController);
  router.get("/:id", authMiddleware, buscarUsuarioPorIdController);
  router.get("/atualizar/:id", authMiddleware, atualizarUsuarioController)

  return router;
}
