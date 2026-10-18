import { z } from "zod";

export const cadastroServicoSchema = z.object({
  nome_servico: z
  .string({error: "Nome do serviço é obrigatório"})
  .trim()
  .min(1, "Nome do serviço é obrigatório"),
  descricao: z
  .string({error: "Descrição do serviço é obrigatória"})
  .trim()
  .min(1, "Descrição do serviço é obrigatória"),
  preco: z
  .number({error: "Preço é obrigatório"})
  .positive("Preço deve ser maior que zero"),
  duracao_horas: z
  .number({error: "Duração é obrigatória"})
  .positive("Duração deve ser maior que zero"),
  id_categoria: z
  .number({error: "Categoria é obrigatória"})
  .positive("Categoria deve ser maior que zero"),
});

export type CadastroServicoInput = z.infer<typeof cadastroServicoSchema>;