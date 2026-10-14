import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { UsuarioRepository } from "../repositories/usuarioRepository";
import { LoginInput } from "../schemas/authSchema";

const HASH_FICTICIO = bcrypt.hashSync("senha-ficticia", 10);

export class AuthService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async login({ email, senha }: LoginInput): Promise<{ token: string }> {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      await bcrypt.compare(senha, HASH_FICTICIO);
      throw new AppError(401, "Dados inválidos!");
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
      throw new AppError(401, "Dados inválidos!");
    }

    if (usuario.ativo !== "Sim") {
      throw new AppError(403, "Usuário inativo");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      env.JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS256" }
    );

    return { token };
  }
}
