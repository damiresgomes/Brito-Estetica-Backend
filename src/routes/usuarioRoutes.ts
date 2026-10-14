import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController";

const usuarioRoutes = Router();
const usuarioController =  new UsuarioController();

usuarioRoutes.post("/", (request, response) => usuarioController.cadastrarUsuario(request, response));

export default usuarioRoutes;