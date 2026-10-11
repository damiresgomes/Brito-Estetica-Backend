import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

interface Usuario extends RowDataPacket {
    id: number;
    nome: string;
    email: string;
    senha: string;
    ativo: string;
}

export class UsuarioRepository {
    async buscarPorEmail (email: string): Promise <Usuario | null> {
        const [usuarios] = await pool.query<Usuario[]>(
            "SELECT id, nome, email, senha, ativo FROM usuario WHERE email = ?",
            [email]
        );

        return usuarios[0] ?? null;
    }
}