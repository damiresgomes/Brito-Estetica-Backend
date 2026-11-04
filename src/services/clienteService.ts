import { buscarPorId, buscarClientes, criarCliente, desativarCliente, atualizarCliente } from "../repositories/clienteRepository";
import { AppError } from "../errors/AppError";
import { Cliente } from "../entities/cliente";
import { CadastroClienteInput } from "../schemas/clienteSchema";

export async function cadastrarCliente(dados: CadastroClienteInput): Promise<{ id: number }> {
    const id = await criarCliente(dados);
    return { id };
}

export async function listarClientes(): Promise<Cliente[]> {
    return buscarClientes();
}

export async function buscarClientePorId(id_cliente: number): Promise<Cliente> {
    const cliente = await buscarPorId(id_cliente);

    if (!cliente) {
        throw new AppError(404, "Cliente não encontrado.");
    }

    return cliente;
}

export async function clienteAtualizar(id_cliente: number, cliente: { nome: string; email: string; telefone: string }): Promise<number> {
    const clienteAtualizado = await atualizarCliente(id_cliente, cliente);

    if (clienteAtualizado === 0) {
        throw new AppError(404, "Cliente não encontrado.");
    }

    return clienteAtualizado;
}

export async function excluirCliente(id_cliente: number): Promise<number> {
    const clienteExcluido = await desativarCliente(id_cliente);

    if (clienteExcluido === 0) {
        throw new AppError(404, "Cliente não encontrado.");
    }

    return clienteExcluido;
}