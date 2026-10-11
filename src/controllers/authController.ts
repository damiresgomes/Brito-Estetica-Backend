import { Request, Response } from "express";
import { emailValido } from "../validators/email";
import { UsuarioRepository } from "../repositories/usuarioRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usuarioRepository = new UsuarioRepository();

export class AuthController {
  async login(request: Request, response: Response) {
    const { email, senha } = request.body ?? {};

    if (!emailValido(email) || !senha) {
      return response.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    if (!emailValido(email)) {
      return response.status(400).json({ message: "E-mail inválido" });
    }

    const usuario =  await usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      return response.status(401).json({ message: "Usuário inválido!" });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
      return response.status(401).json({ message: "Senha inválida!"});
    }

    const secretSenha = process.env.JWT_SECRET;

    if (!secretSenha) {
      return response.status(500).json({ message: "Erro no servidor"});
    }

    const token = jwt.sign(
      {id: usuario.id, email: usuario.email },
      secretSenha,
      { expiresIn: "1h"}
    )

    return response.status(200).json({ token });
  }
}