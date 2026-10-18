import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Erro de validação",
      erros: error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return response.status(500).json({ message: "Erro interno do servidor" });
}
