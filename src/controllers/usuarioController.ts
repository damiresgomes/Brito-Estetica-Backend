import { FastifyReply, FastifyRequest } from "fastify";
import { cadastroUsuarioSchema } from "../schemas/usuarioSchema";
import { UsuarioService } from "../services/usuarioService";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  async cadastrar(request: FastifyRequest, reply: FastifyReply) {
    const dados = cadastroUsuarioSchema.parse(request.body);
    const { id } = await this.usuarioService.cadastrar(dados);

    return reply.status(201).send({
      message: "Usuário cadastrado com sucesso",
      id,
    });
  }
}
