# Validações: e-mail e senha

Regras de validação do back-end (Brito Estética) e onde cada uma é usada.

## Resumo

| Validação | Arquivo | Onde é usada | Status |
|---|---|---|---|
| Formato do e-mail (regex) | `src/validators/email.ts` | Login, cadastro| Feito |

## Validação de e-mail

**Arquivo:** `src/validators/email.ts`

```ts
export function emailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

**O que a regex exige:** algo antes do `@`, um domínio, um ponto e um final (`algo@algo.algo`). Espaços e mais de um `@` são recusados.

**Uso no login** (`src/controllers/authController.ts`), nesta ordem:
1. Se faltar `email` ou `senha`: `400` com `"E-mail e senha são obrigatórios"`.
2. Se `!emailValido(email)`: `400` com `"E-mail inválido"`.
3. Se email e senha estiverem ok : `200` com `Login Recebido`.


### Testes

| E-mail | Esperado |
|---|---|
| `a@a.com` | válido |
| `abc` | inválido |
| `a@a` | inválido |
| `a a@a.com` | inválido |
| ausente | `400` "E-mail e senha são obrigatórios" |


## Como testar

-- Rodar o servidor: `npm run dev` (deve exibir Servidor rodando na porta 3333).
No Insomnia, enviar POST http://localhost:3333/api/auth/login com Body em JSON.

## Teste	Body	Esperado

- Campos completos	`{ "email": "a@a.com", "senha": "123" }`	200
- Sem senha	`{ "email": "a@a.com" }`	400
- Sem e-mail	`{ "senha": "123" }`	400
- Corpo vazio	`{}`	400