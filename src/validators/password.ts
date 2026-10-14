export function senhaForte (senha: string): boolean {
    const tamanho = senha.length >= 8;
    const umaLetraMaiuscula = /[A-Z]/.test(senha);
    const numero = /[0-9]/.test(senha);
    const simbolo = /[^A-Za-z0-9]/.test(senha);

    return tamanho && umaLetraMaiuscula && numero && simbolo;
}