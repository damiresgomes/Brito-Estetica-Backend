import { FastifyInstance } from "fastify";
import { UsuarioController } from "../controllers/usuarioController";
import { UsuarioService } from "../services/usuarioService";
import { UsuarioRepository } from "../repositories/usuarioRepository";

export async function usuarioRoutes(app: FastifyInstance): Promise<void> {
  const usuarioRepository = new UsuarioRepository();
  const usuarioService = new UsuarioService(usuarioRepository);
  const usuarioController = new UsuarioController(usuarioService);

  app.post("/", (request, reply) => usuarioController.cadastrar(request, reply));
}
