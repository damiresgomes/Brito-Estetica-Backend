import { Request, Response } from "express";
import { cadastroClienteSchema } from "../schemas/clienteSchema";
import { cadastrarCliente, listarClientes, buscarClientePorId } from "../services/clienteService";

export async function cadastrarClienteController(request: Request, response: Response): Promise<Response> {
    const dados = cadastroClienteSchema.parse(request.body);
    const { id } = await cadastrarCliente(dados);

    return response.status(201).json({ 
        message: "Cliente cadastrado com sucesso",
        id,
     });
}

export async function listarClientesController(request: Request, response: Response): Promise<Response> {
    const clientes = await listarClientes();

    return response.status(200).json(clientes);
}

export async function buscarClientePorIdController(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const cliente = await buscarClientePorId(Number(id));

    return response.status(200).json(cliente);
}

