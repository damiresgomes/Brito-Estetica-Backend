import { Request, Response } from "express";
import { cadastroUsuarioSchema } from "../schemas/usuarioSchema";
import { UsuarioService } from "../services/usuarioService";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  async cadastrar(request: Request, response: Response): Promise<Response> {
    const dados = cadastroUsuarioSchema.parse(request.body);
    const { id } = await this.usuarioService.cadastrar(dados);

    return response.status(201).json({
      message: "Usuário cadastrado com sucesso",
      id,
    });
  }
}
