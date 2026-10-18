import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController";
import { UsuarioService } from "../services/usuarioService";
import { UsuarioRepository } from "../repositories/usuarioRepository";

export function usuarioRoutes(): Router {
  const router = Router();

  const usuarioRepository = new UsuarioRepository();
  const usuarioService = new UsuarioService(usuarioRepository);
  const usuarioController = new UsuarioController(usuarioService);

  router.post("/", (request, response) =>
    usuarioController.cadastrar(request, response)
  );

  router.get("/", (request, response) =>
    usuarioController.listar(request, response)
  );

  return router;
}
