import { Request, Response } from "express";
import { emailValido } from "../validators/email";

export class AuthController {
  login(request: Request, response: Response) {
    const { email, senha } = request.body;

    if (!emailValido(email) || !senha) {
      return response.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    if (!emailValido(email)) {
      return response.status(400).json({ message: "E-mail inválido" });
    }

    return response.status(200).json({ message: "Login recebido" });
  }
}