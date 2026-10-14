import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function errorHandler(
  error: FastifyError | AppError | ZodError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação",
      erros: error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  request.log.error(error);
  return reply.status(500).send({ message: "Erro interno do servidor" });
}
