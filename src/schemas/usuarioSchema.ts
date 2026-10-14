import { z } from "zod";
import { cpfValido } from "../validators/cpf";

const emailSchema = z
  .string({ error: "E-mail é obrigatório" })
  .trim()
  .toLowerCase()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail é inválido");

const senhaSchema = z
  .string({ error: "Senha é obrigatória" })
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres")
  .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter um número")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter um símbolo");

const dataNascimentoSchema = z
  .string({ error: "Data de nascimento é obrigatória" })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato AAAA-MM-DD")
  .refine((valor) => !Number.isNaN(Date.parse(valor)), "Data de nascimento inválida");

export const cadastroUsuarioSchema = z.object({
  nome: z
    .string({ error: "Nome é obrigatório" })
    .trim()
    .min(1, "Nome é obrigatório"),
  email: emailSchema,
  senha: senhaSchema,
  cpf: z.string({ error: "CPF é obrigatório" }).refine(cpfValido, "CPF inválido"),
  salario: z
    .number({ error: "Salário é obrigatório" })
    .nonnegative("Salário não pode ser negativo"),
  datanascimento: dataNascimentoSchema,
});

export type CadastroUsuarioInput = z.infer<typeof cadastroUsuarioSchema>;
