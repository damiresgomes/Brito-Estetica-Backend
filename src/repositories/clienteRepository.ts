import { pool } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Cliente } from "../entities/cliente";

export interface NovoCliente {
  nome: string;
  email: string;
  telefone: string;
}

interface ClienteRow extends RowDataPacket, Cliente { }

const COLUNAS = "id_cliente, nome, email, telefone, data_cadastro"

export async function buscarPorId(id_cliente: number): Promise<Cliente | null> {
        const [clientes] = await pool.execute<ClienteRow[]>(
            `SELECT ${COLUNAS} FROM clientes WHERE id_cliente = ?`,
            [id_cliente]
        );

        return clientes[0] ?? null; 
    }

    export async function buscarClientes(): Promise<Cliente[]> {
        const [clientes] = await pool.execute<ClienteRow[]>(
            `SELECT ${COLUNAS} FROM clientes`
        );

        return clientes;
    }

    export async function buscarClientesPorNome(nome: string): Promise<Cliente[] | null> {
        const [clientes] = await pool.execute<ClienteRow[]>(
            `SELECT ${COLUNAS} FROM clientes WHERE nome LIKE CONCAT('%', ? , '%')`,
            [nome]
        );
        return clientes ?? null;
    }

    export async function criarCliente(cliente: NovoCliente): Promise<number> {
        const [criado] = await pool.execute<ResultSetHeader>(
            `INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)`,
            [
                cliente.nome,
                cliente.email,
                cliente.telefone
            ]
        );

        return criado.insertId;
    }

    export async function atualizarCliente(id_cliente: number, cliente: NovoCliente): Promise<number> {
        const [atualizado] = await pool.execute<ResultSetHeader>(
            `UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id_cliente = ?`,
            [
                cliente.nome,
                cliente.email,
                cliente.telefone,
                id_cliente
            ]
        );
        return atualizado.affectedRows;
    }

    export async function desativarCliente(id_cliente: number): Promise<number> {
        const [desativado] = await pool.execute<ResultSetHeader>(
            `UPDATE clientes SET ativo = 0 WHERE id_cliente = ?`,
            [id_cliente]
        );
        return desativado.affectedRows;
    }