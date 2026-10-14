import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError";
import { UsuarioRepository } from "../repositories/usuarioRepository";
import { CadastroUsuarioInput } from "../schemas/usuarioSchema";
import { normalizarCpf } from "../validators/cpf";

export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async cadastrar(dados: CadastroUsuarioInput): Promise<{ id: number }> {
    const emailEmUso = await this.usuarioRepository.buscarPorEmail(dados.email);

    if (emailEmUso) {
      throw new AppError(409, "E-mail já cadastrado");
    }

    const cpf = normalizarCpf(dados.cpf);
    const cpfEmUso = await this.usuarioRepository.buscarPorCpf(cpf);

    if (cpfEmUso) {
      throw new AppError(409, "CPF já cadastrado");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const id = await this.usuarioRepository.criarUsuario({
      nome: dados.nome,
      email: dados.email,
      senhaHash,
      cpf,
      salario: dados.salario,
      datanascimento: dados.datanascimento,
    });

    return { id };
  }
}
