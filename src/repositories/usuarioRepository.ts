import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import { NovoUsuario, Usuario } from "../types/usuario";

interface UsuarioRow extends RowDataPacket, Usuario {}

const COLUNAS = "id, nome, email, senha, cpf, salario, datanascimento, ativo";

export class UsuarioRepository {
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const [usuarios] = await pool.execute<UsuarioRow[]>(
      `SELECT ${COLUNAS} FROM usuario WHERE email = ?`,
      [email]
    );

    return usuarios[0] ?? null;
  }

  async buscarPorCpf(cpf: string): Promise<Usuario | null> {
    const [usuarios] = await pool.execute<UsuarioRow[]>(
      `SELECT ${COLUNAS} FROM usuario
        WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = ?`,
      [cpf]
    );

    return usuarios[0] ?? null;
  }

  async criarUsuario(usuario: NovoUsuario): Promise<number> {
    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO usuario
         (nome, email, senha, cpf, salario, datanascimento, ativo)
       VALUES (?, ?, ?, ?, ?, ?, 'Sim')`,
      [
        usuario.nome,
        usuario.email,
        usuario.senhaHash,
        usuario.cpf,
        usuario.salario,
        usuario.datanascimento,
      ]
    );

    return resultado.insertId;
  }
}
