import { pool } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Agendamento } from "../entities/agendamento";

interface AgendamentoRow extends RowDataPacket, Agendamento { }

export async function buscarAgendamento(id_agendamento: number): Promise<Agendamento | null> {
    const [agendamentos] = await pool.execute<AgendamentoRow[]>(
        `SELECT * FROM agendamentos WHERE id_agendamento = ?`,
        [id_agendamento]
    );

    return agendamentos[0] ?? null;
}

export async function criarAgendamento(agendamento: { data_hora: Date, modelo_carro: string, placa: string, id_cliente: number }): Promise<number> {
    const [criado] = await pool.execute<ResultSetHeader>(
        `INSERT INTO agendamentos (data_hora, modelo_carro, placa, id_cliente) VALUES (?, ?, ?, ?)`,
        [
            agendamento.data_hora,
            agendamento.modelo_carro,
            agendamento.placa,
            agendamento.id_cliente
        ]
    );

    return criado.insertId;
}