import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "E-mail é obrigatório" })
    .trim()
    .toLowerCase()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail é inválido"),
  senha: z.string({ error: "Senha é obrigatória" }).min(1, "Senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;
