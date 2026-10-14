# Brito Estética — Back-end

API REST em **Node.js + Fastify + TypeScript**, com banco **MySQL 8 em Docker**.
Organizada em camadas e com validação via **Zod**.

**Autoras:** Damires Gomes e Cristiani Budnik

---

## 1. Visão geral

Fluxo de uma requisição:

```
Cliente (front / Insomnia / Thunder Client)
   -> app.ts          (cria o Fastify, plugins e rotas)
   -> routes/         (URL + método HTTP -> controller)
   -> controllers/    (valida a entrada com Zod e devolve a resposta)
   -> services/       (regras de negócio)
   -> repositories/   (único lugar que fala com o MySQL)
   -> MySQL (Docker)
```

Cada camada tem **uma responsabilidade**:

| Pasta | Responsabilidade |
|---|---|
| `config/` | Conexão com o banco e validação das variáveis de ambiente |
| `routes/` | Liga endereço + método HTTP ao controller |
| `controllers/` | Valida a entrada (Zod) e monta a resposta HTTP. |
| `services/` | Regras de negócio (duplicidade, senha, token) |
| `repositories/` | Acesso ao MySQL (prepared statements) |
| `schemas/` | Schemas de validação do Zod |
| `middlewares/` | Autenticação (JWT) e tratamento de erros |
| `errors/` | Erros de domínio |
| `validators/` | Funções auxiliares (ex.: cálculo de CPF) |
| `types/` | Tipos e interfaces do domínio |

**`app.ts` x `server.ts`:** `app.ts` monta o servidor (plugins + rotas) e exporta
a função `buildApp`; `server.ts` apenas liga na porta. Assim dá para testar a API
sem subir o servidor.

---

## 2. Tecnologias

| Tecnologia | Uso |
|---|---|
| TypeScript (`strict`) | Tipagem sem `any` |
| Fastify v5 | Servidor HTTP e rotas |
| Zod v4 | Validação de entrada e das variáveis de ambiente |
| bcrypt | Hash e comparação de senhas |
| jsonwebtoken | Geração/verificação do token JWT |
| mysql2 | Driver do MySQL (com pool) |
| dotenv | Leitura do `.env` |
| @fastify/cors | Cabeçalhos de CORS |
| @fastify/helmet | Cabeçalhos de segurança |
| tsx | Executa `.ts` em desenvolvimento |
| MySQL 8 (Docker) | Banco de dados |

---

## 3. Por que dessas escolhas

### 3.1 Fastify no lugar do Express

| Aspecto | Express | Fastify |
|---|---|---|
| Handler | `(req, res)` | `(request, reply)` |
| Erros em async | Precisa de `try/catch`/wrapper | Captura sozinho e envia ao `setErrorHandler` |
| Plugins | Terceiros variados | Oficiais (`@fastify/cors`, `@fastify/helmet`) |
| Performance | Base | Roteamento otimizado |

O maior ganho aqui foi o **tratamento de erro central**: com um único
`setErrorHandler` tratamos `ZodError` (400), `AppError` (401/403/409) e erros
inesperados (500), sem repetir `try/catch` em cada rota.

### 3.2 Zod para validação

Antes havia funções soltas (`emailValido`, `senhaForte`) chamadas em pontos
diferentes. Com Zod:

- A regra vira um **schema declarativo** (`schemas/`).
- O schema **infere o tipo** TypeScript (`z.infer`), eliminando `request.body: any`.
- As mensagens de erro ficam em pt-BR, junto da regra.
- O **mesmo Zod valida as variáveis de ambiente** (`config/env.ts`), fazendo o
  servidor parar com mensagem clara se faltar alguma.

O algoritmo de CPF (que é cálculo, não formato) continua em `validators/cpf.ts`,
mas é chamado dentro de um `.refine()` do schema.

### 3.3 Camada `services`

Tirar a regra de negócio do controller. O controller só valida a entrada e
devolve a resposta; o service decide (e-mail em uso? senha correta? usuário ativo?).
Isso deixa o código testável e cada peça pequena.

### 3.4 Camada de erros

`AppError` representa um erro **esperado** do domínio, já com o status HTTP.
O `errorHandler` distingue:

- `ZodError` -> `400` com a lista de campos inválidos.
- `AppError` -> status definido no próprio erro.
- Qualquer outro -> `500` genérico (o detalhe fica só no log, não vai pro cliente).

---

## 4. Estrutura do projeto

```
Brito-Estetica-Backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── usuarioController.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── repositories/
│   │   └── usuarioRepository.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── usuarioRoutes.ts
│   ├── schemas/
│   │   ├── authSchema.ts
│   │   └── usuarioSchema.ts
│   ├── services/
│   │   ├── authService.ts
│   │   └── usuarioService.ts
│   ├── types/
│   │   └── usuario.ts
│   ├── validators/
│   │   └── cpf.ts
│   ├── app.ts
│   └── server.ts
├── docker/
│   └── init/ (scripts .sql executados na criação do banco)
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Como rodar

1. Instalar **Node.js** e o **Docker Desktop** (abrir e esperar "Engine running").
2. Instalar dependências:
   ```powershell
   npm install
   ```
3. Criar o `.env`: copiar `.env.example`, renomear para `.env` e preencher.
4. Subir o banco:
   ```powershell
   docker compose up -d
   docker compose ps
   ```
   Esperar o MySQL ficar pronto (`docker compose logs mysql` mostra `ready for connections`).
5. Rodar a API:
   ```powershell
   npm run dev
   ```
6. Verificação de tipos antes de commitar:
   ```powershell
   npx tsc --noEmit
   ```

| Script | O que faz |
|---|---|
| `npm run dev` | Executa o `.ts` direto, reiniciando ao salvar |
| `npm run build` | Compila para `.js` em `dist/` |
| `npm start` | Roda o código compilado |

---

## 6. Variáveis de ambiente

`.env` (não vai para o Git):

```
PORT=3333
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=<usuario>
DB_PASS=<senha>
DB_NAME=<banco>
DB_ROOT_PASSWORD=<senha_do_root>
JWT_SECRET=<texto_longo_e_aleatorio>
```

Regras:
- Sem espaço depois do `=`.
- Nunca subir senhas para o Git (o `.env` está no `.gitignore`).
- Os nomes precisam ser iguais aos usados em `config/env.ts`.

`config/env.ts` valida tudo com Zod no start. Se faltar alguma variável, o
servidor imprime os erros e encerra. Assim fica mais fácil de identificar qual é o erro para fazer a manutenção.

---

## 7. Endpoints

### `POST /api/auth/login` (pública)

Requisição:
```json
{ "email": "admin@gmail.com", "senha": "Senha@123" }
```

| Status | Quando | Corpo |
|---|---|---|
| `200` | credenciais corretas e usuário ativo | `{ "token": "..." }` |
| `400` | campo faltando ou e-mail inválido | `{ "message": "Erro de validação", "erros": [ ... ] }` |
| `401` | usuário não existe ou senha errada | `{ "message": "Dados inválidos!" }` |
| `403` | usuário inativo | `{ "message": "Usuário inativo" }` |
| `500` | erro inesperado | `{ "message": "Erro interno do servidor" }` |

O token JWT expira em 1h e usa o algoritmo `HS256`.

### `POST /api/usuarios` (pública)

Requisição:
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "Senha@123",
  "cpf": "111.444.777-35",
  "salario": 3500,
  "datanascimento": "1990-05-20"
}
```

| Status | Quando | Corpo |
|---|---|---|
| `201` | cadastrado | `{ "message": "Usuário cadastrado com sucesso", "id": 10 }` |
| `400` | dados inválidos | `{ "message": "Erro de validação", "erros": [ ... ] }` |
| `409` | e-mail ou CPF já cadastrado | `{ "message": "E-mail já cadastrado" }` |
| `500` | erro inesperado | `{ "message": "Erro interno do servidor" }` |

Regras de validação:
- `email`: formato `algo@algo.algo`; é convertido para minúsculas.
- `senha`: mínimo 8 e máximo 72 caracteres, com maiúscula, minúscula, número e símbolo.
- `cpf`: dígitos verificadores validados; gravado apenas com números.
- `salario`: número `>= 0` (no JSON, ex.: `3500`, não `"3500"`).
- `datanascimento`: formato `AAAA-MM-DD`.

---

## 8. Segurança

| Item | Como |
|---|---|
| Senha | Nunca em texto puro: `bcrypt.hash(senha, 10)` |
| Login | Mensagem genérica ("Dados inválidos!") e comparação com hash fictício quando o usuário não existe (mitiga *timing attack*) |
| Usuário inativo | Bloqueado (`403`) mesmo com senha correta |
| JWT | `HS256` explícito, `expiresIn: "1h"`, segredo em `JWT_SECRET` |
| Cabeçalhos | `@fastify/helmet` |
| CORS | `@fastify/cors` |
| SQL | Sempre prepared statements (`pool.execute` com `?`) |
| Erros | Detalhes inesperados não vão para o cliente (só para o log) |

---

## 9. Banco de dados

- MySQL 8 em Docker, com volume `mysql_data` (dados persistem).
- `docker/init/*.sql` roda **uma vez**, na primeira criação do volume.
- A tabela `usuario` agora tem `UNIQUE` em `email` e `cpf`, garantindo
  integridade no banco além da checagem feita no service.

| Ação | Comando |
|---|---|
| Subir | `docker compose up -d` |
| Ver estado | `docker compose ps` |
| Ver logs | `docker compose logs mysql --tail 20` |
| Recriar do zero (apaga dados) | `docker compose down -v` e depois `docker compose up -d` |

> O `.sql` só roda com o volume vazio. Mudar o `.env` depois não altera o que já
> foi gravado no volume.

---

## 10. Decisões (o quê / por quê)

| Decisão | Por quê |
|---|---|
| Fastify no lugar do Express | `setErrorHandler` central, plugins oficiais, tipagem e performance |
| Zod para validar | Uma só fonte de regra, mensagens em pt-BR e tipos inferidos |
| Zod também nas variáveis de ambiente | Falha cedo e com mensagem clara |
| Camada `services` | Controller só valida/responde; regra de negócio isolada e testável |
| `AppError` | Separar erro esperado (401/403/409) de erro inesperado (500) |
| `@fastify/helmet` + `@fastify/cors` | Cabeçalhos de segurança e CORS |
| JWT `HS256` explícito | Evita *algorithm confusion* |
| Hash fictício no login | Tempo de resposta parecido exista ou não o e-mail |
| Checar `ativo` | Impede login de usuário desativado |
| `UNIQUE` em email/cpf | Integridade garantida pelo banco |
| `pool.execute` | Prepared statements (mais seguro) |
| `REPLACE` no `buscarPorCpf` | Casa CPFs antigos gravados com pontos/traço |
| `validators/cpf.ts` mantido | É cálculo, não formato; usado dentro de um `.refine` do Zod |

---

## 11. Teste rápido (Insomnia)

`POST http://localhost:3333/api/auth/login`, Body **JSON**:

| Body | Esperado |
|---|---|
| `{ "email": "a@a.com", "senha": "123" }` | `401` (usuário não existe) |
| `{ "email": "a@a.com" }` | `400` (senha obrigatória) |
| `{ "email": "abc", "senha": "123" }` | `400` (e-mail inválido) |
| `{ "email": "admin@gmail.com", "senha": "<correta>" }` | `200` com `token` |