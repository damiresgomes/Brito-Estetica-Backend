import * as servicoRepository from "../repositories/servicoRepository";
import { AppError } from "../errors/AppError";
import { CadastroServicoInput } from "../schemas/servicoSchema";
import { Servico } from "../types/servico";

export async function criarServico(dados: CadastroServicoInput): Promise<{ id: number }> {
    const nomeServicoJaCadastrado = await servicoRepository.buscarServico(dados.nome_servico)

    if (nomeServicoJaCadastrado) {
        throw new AppError(409, "Nome de serviço já cadastrado.")
    }

    const id = await servicoRepository.criarServico({
        nome_servico: dados.nome_servico,
        descricao: dados.descricao,
        preco: dados.preco,
        duracao_horas: dados.duracao_horas,
        id_categoria: dados.id_categoria,
    });

    return { id };
}

export async function listarServicos(): Promise<Servico[]> {
    return servicoRepository.listarServicos();
}

export async function atualizarServico(id_servico: number, servico: CadastroServicoInput): Promise<number> {
    const servicoAtualizado = await servicoRepository.atualizarServico(id_servico, { ...servico, id_servico })

    if (servicoAtualizado === 0) {
        throw new AppError(404, "Serviço não encontrado.")
    }

    return servicoAtualizado;
}

export async function excluirServico(id_servico: number): Promise<number> {
    const servicoExcluido = await servicoRepository.excluirServico(id_servico)

    if (servicoExcluido === 0) {
        throw new AppError(404, "Serviço não encontrado.")
    }

    if (servicoExcluido >= 1) {
        throw new AppError(409, "Não foi possível excluir o serviço pois ele possui dependências.")
    }

    return servicoExcluido;
}