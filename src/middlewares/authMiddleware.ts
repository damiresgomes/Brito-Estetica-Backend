import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export interface TokenPayload {
  id: number;
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    usuario?: TokenPayload;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const cabecalho = request.headers.authorization;

  if (!cabecalho?.startsWith("Bearer ")) {
    throw new AppError(401, "Token não informado");
  }

  const token = cabecalho.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    request.usuario = payload as TokenPayload;
  } catch {
    throw new AppError(401, "Token inválido ou expirado");
  }
}
