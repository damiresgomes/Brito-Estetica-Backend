import { z } from "zod";

export const criarAgendamentoSchema = z.object({
  data_hora: z.string().datetime({ offset: true }).refine(
    (valor) => new Date(valor).getTime() > Date.now(),
    "O agendamento precisa ser em uma data futura."
  ),
  placa_veiculo: z.string().trim().min(5).max(10),
  modelo_veiculo: z.string().trim().min(2).max(50),
  servicos: z.array(z.number().int().positive()).min(1).max(10)
    .refine((ids) => new Set(ids).size === ids.length, "Não repita serviços no mesmo agendamento."),
});

export const atualizarStatusAgendamentoSchema = z.object({
  status: z.enum(["Pendente", "Confirmado", "Em atendimento", "Concluído", "Cancelado"]),
});

export type CriarAgendamentoInput = z.infer<typeof criarAgendamentoSchema>;
export type StatusAgendamento = z.infer<typeof atualizarStatusAgendamentoSchema>["status"];
