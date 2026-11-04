import { z } from "zod";
import { cpfValido } from "../validators/cpf";
import { cnpjValido } from "../validators/cnpj";
import { dataDeCalendarioValida, dataNaoEstaNoFuturo, temIdadeMinima } from "../validators/data";

export const cadastroClienteSchema = z.object({
    nome: z.string().min(2).max(100),
    email: z.string().email(),
    telefone: z.string().min(10).max(15),
    cpf: z.string().refine(cpfValido, "CPF inválido."),
    cnpj: z.string().refine(cnpjValido, "CNPJ inválido."),
    data_nascimento: z.string().refine(dataDeCalendarioValida, "Data de nascimento inválida.")
        .refine(dataNaoEstaNoFuturo, "A data de nascimento não pode ser no futuro.")
        .refine((data) => temIdadeMinima(data, 18), "O cliente deve ter pelo menos 18 anos.")
});

export type CadastroClienteInput = z.infer<typeof cadastroClienteSchema>;