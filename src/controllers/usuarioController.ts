import { Request, Response } from "express";
import { emailValido } from "../validators/email";
import { senhaForte } from "../validators/password";
import { cpfValido } from "../validators/cpf";

export class UsuarioController {
    async cadastrarUsuario(request: Request, response: Response) {
        const { nome, email, senha, cpf, salario, datanascimento } = request.body ?? {};

        if (!nome || !email || !senha || !cpf || salario === undefined || !datanascimento) {
            return response.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        if (!emailValido(email)) {
            return response.status(400).json({ message: "E-mail é inválido!"});
        }

        if (!senhaForte(senha)) {
            return response.status(400).json({ message: "Senha sem os requisitos necessários! Use pelo menos 8 caracteres, letra maiúscula, número e símbolo."});
        }

        if (!cpfValido(cpf)) {
            return response.status(400).json({ message: "CPF inválido! Revise o CPF."});
        }

        return response.status(201).json({ message: "Dados Válidos!"});
    }
}