import { FastifyReply, FastifyRequest } from "fastify";
import { loginSchema } from "../schemas/authSchema";
import { AuthService } from "../services/authService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const dados = loginSchema.parse(request.body);
    const { token } = await this.authService.login(dados);

    return reply.status(200).send({ token });
  }
}
