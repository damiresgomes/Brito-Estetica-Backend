import { Request, Response } from "express";
import { loginSchema } from "../schemas/authSchema";
import { AuthService } from "../services/authService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: Request, response: Response): Promise<Response> {
    const dados = loginSchema.parse(request.body);
    const { token } = await this.authService.login(dados);

    return response.status(200).json({ token });
  }

  async teste(request: Request, response: Response): Promise<Response> {
    return response.status(200).json({ usuario: request.usuario });
  }
}
