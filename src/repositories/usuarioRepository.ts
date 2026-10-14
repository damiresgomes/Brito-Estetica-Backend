import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/database";

interface Usuario extends RowDataPacket {
    id: number;
    nome: string;
    email: string;
    senha: string;
    ativo: string;
}

export interface NovoUsuario {
    nome: string;
    email: string;
    senhaHash: string;
    cpf: string;
    salario: number;
    datanascimento: string;
}

export class UsuarioRepository {
    async buscarPorEmail (email: string): Promise <Usuario | null> {
        const [usuarios] = await pool.query<Usuario[]>(
            "SELECT id, nome, email, senha, ativo FROM usuario WHERE email = ?",
            [email]
        );

        return usuarios[0] ?? null;
    }

    async criarUsuario(usuario: NovoUsuario): Promise<number> {
        const [cadastros] = await pool.query<ResultSetHeader>(
            "INSERT INTO usuario (nome, email, senha, cpf, salario, datanascimento, ativo) VALUES (?, ?, ?, ?, ?, ?, 'Sim')",
            [
                usuario.nome,
                usuario.email,
                usuario.senhaHash,
                usuario.cpf,
                usuario.salario,
                usuario.datanascimento,
            ]
        );

        return cadastros.insertId;
    }

    async buscaPorCpf (cpf: string): Promise<Usuario | null> {
        const [usuarios] = await pool.query<Usuario[]>(
            "SELECT id, nome, email, senha, ativo FROM usuario WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?",
            [cpf.replace(/\D/g, "")]
        );

        return usuarios[0] ?? null;
    }
}
