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




# Brito Estética — Back-end: documentação do que foi feito

**Autoras:** Damires Gomes e Cristiani Budnik
**Repositório:** `damiresgomes/Brito-Estetica-Backend`

---

## 1. Visão geral

API REST em **Node.js + Express + TypeScript**, com banco **MySQL 8 rodando em container Docker**. O projeto parte de uma versão antiga em PHP; a lógica antiga é usada só como consulta, e o código novo é escrito do zero em TypeScript, organizado em camadas.

```
Cliente (front / Thunder Client)
   -> app.ts            (express.json, rotas)
   -> routes            (endereço -> controller)
   -> controllers       (recebe o pedido e responde)
   -> services          (regras de negócio)      [a criar]
   -> repositories      (acesso ao MySQL)         [a criar]
   -> MySQL (Docker)
```

### Status resumido

| Item | Situação |
|---|---|
| Ambiente (npm, TypeScript, Git) | Concluído |
| Servidor Express | Concluído |
| Rota e controller de login (recebe e valida campos) | Concluído |
| Validação de e-mail por regex | Concluído |
| MySQL em Docker + conexão da API | Concluído |
| Erros customizados e `errorHandler` | Pendente |
| `authService` | Pendente |
| `userRepository.findByEmail` | Pendente |
| Verificação de usuário existente (401) | Pendente |
| bcrypt (comparação da senha) | Pendente |
| JWT | Pendente |

---

## 2. Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 24.x | Ambiente de execução |
| TypeScript | ^7.0.2 | Linguagem (modo `strict`) |
| tsx | ^4.23.15 | Roda `.ts` em desenvolvimento |
| Express | ^5.2.1 | Servidor HTTP e rotas |
| dotenv | ^18.0.5 | Leitura do `.env` |
| mysql2 | atual | Driver do MySQL (com pool) |
| MySQL | 8.0 (Docker) | Banco de dados |
| Docker Compose | — | Sobe o MySQL com volume |

Tipos: `@types/node`, `@types/express`. O `mysql2` já traz os próprios tipos.

**Como o TypeScript roda no Node:** o Node só entende JavaScript. Em desenvolvimento, o `tsx` traduz o `.ts` na hora (`npm run dev`). Para produção, o `tsc` converte tudo para `.js` na pasta `dist/` (`npm run build`), e o Node roda `dist/server.js` (`npm start`).

---

## 3. Estrutura do projeto

### Existente

```
Brito-Estetica-Backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── categoriaController.ts
│   │   ├── servicoController.ts
│   │   └── usuarioController.ts
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── categoriaRoutes.ts
│   │   ├── servicoRoutes.ts
│   │   └── usuarioRoutes.ts
│   ├── validators/
│   │   └── email.ts
│   ├── app.ts
│   └── server.ts
├── docker/
│   └── init/            (scripts .sql executados na criação do banco)
├── docker-compose.yml
├── .env                 (não vai para o Git)
├── .env.example         (vai para o Git)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Previsto (a criar conforme as tarefas avançam)

`entities/`, `types/`, `errors/`, `repositories/`, `services/` e mais validadores (`password.ts`, `cpf.ts`).

### Responsabilidade de cada pasta

| Pasta | Responsabilidade |
|---|---|
| `config/` | Conexão com o banco e variáveis de ambiente |
| `controllers/` | Recebem `request`, chamam o service e devolvem `response`. Sem regra de negócio |
| `routes/` | Ligam endereço e método HTTP ao controller |
| `middlewares/` | Autenticação (JWT) e tratamento de erros |
| `validators/` | Funções que respondem verdadeiro/falso (e-mail, senha, CPF) |
| `services/` *(a criar)* | Regras de negócio |
| `repositories/` *(a criar)* | Único lugar que fala com o MySQL |
| `entities/`, `types/`, `errors/` *(a criar)* | Classes de domínio, interfaces/generics e exceções customizadas |

**Separação `app.ts` x `server.ts`:** `app.ts` monta o servidor (middlewares e rotas) e exporta; `server.ts` só liga na porta. Assim o `app` pode ser testado sem subir o servidor.

---

## 4. Configuração do projeto

### 4.1 `package.json`

```json
{
  "name": "brito-estetica-backend",
  "version": "1.0.0",
  "license": "ISC",
  "author": "Damires Gomes e Cristiani Budnik",
  "type": "commonjs",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

(demais campos e dependências omitidos aqui; o arquivo real também lista `dependencies` e `devDependencies`.)

| Script | O que faz | Cria `dist/`? |
|---|---|---|
| `npm run dev` | Executa o `.ts` direto, reiniciando ao salvar | Não |
| `npm run build` | Compila para `.js` em `dist/` | Sim |
| `npm start` | Roda o código compilado | Não |

### 4.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "types": ["node"],
    "esModuleInterop": true,
    "strict": true,
    "sourceMap": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- `strict: true` garante a checagem rígida de tipos (sem `any`).
- `types: ["node"]` liga os tipos do Node.
- `module` e `moduleResolution` em `Node16` resolvem o erro TS2882 do `import "dotenv/config"`. O `package.json` continua com `"type": "commonjs"`.
- Foi removido o `verbatimModuleSyntax` do arquivo padrão do `tsc --init`, que não combina com projeto CommonJS.

### 4.3 `.gitignore`

```
node_modules
dist
.env
arquivos_proj3/
```

Cuidado para não usar `.env*`, pois isso esconderia também o `.env.example`.

### 4.4 Variáveis de ambiente

`.env` (valores reais, **fora do Git**):

```
PORT=3333
DB_HOST="127.0.0.1"
DB_PORT=3306
DB_USER="<usuario>"
DB_PASS="<senha_do_usuario>"
DB_NAME="<nome_do_banco>"
DB_ROOT_PASSWORD="<senha_do_root>"
JWT_SECRET="<texto_longo_e_aleatorio>"   (usado na etapa do JWT)
```

`.env.example` (vai ao Git): as mesmas chaves, **sem os valores secretos**.

| Chave | Quem usa |
|---|---|
| `DB_ROOT_PASSWORD` | Docker (`MYSQL_ROOT_PASSWORD`). A API nunca usa |
| `DB_USER`, `DB_PASS`, `DB_NAME` | Docker (cria o usuário e o banco) **e** a API |
| `DB_HOST`, `DB_PORT` | API |
| `JWT_SECRET` | `authService`, ao gerar o token |

Regras: sem espaço depois do `=`; os nomes no `.env` e onde são usados precisam ser idênticos; nunca colocar senhas em código, README, commits, prints ou chat.

---

## 5. Código implementado

### 5.1 `src/app.ts`

```ts
import express from "express";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());              // 1º: aprende a ler JSON
app.use("/api/auth", authRoutes);     // 2º: depois as rotas

export default app;
```

A ordem importa: se as rotas vierem antes do `express.json()`, o `request.body` chega `undefined`.

### 5.2 `src/server.ts`

```ts
import app from "./app";

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
```

### 5.3 `src/controllers/authController.ts`

```ts
import { Request, Response } from "express";
import { emailValido } from "../validators/email";

export class AuthController {
  login(request: Request, response: Response) {
    const { email, senha } = request.body ?? {};

    if (!email || !senha) {
      return response.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    if (!emailValido(email)) {
      return response.status(400).json({ message: "E-mail inválido" });
    }

    return response.status(200).json({ message: "Login recebido" });
  }
}
```

A checagem de campos ausentes vem **antes** da de formato. O `?? {}` evita que um pedido sem corpo derrube a rota.

### 5.4 `src/routes/authRoutes.ts`

```ts
import { Router } from "express";
import { AuthController } from "../controllers/authController";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (request, response) => authController.login(request, response));

export default authRoutes;
```

A função de seta evita perder o contexto (`this`) da classe.

### 5.5 `src/validators/email.ts`

```ts
export function emailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

Exige algo antes do `@`, um domínio, um ponto e um final (`algo@algo.algo`). Reaproveitável no cadastro. Na edição de usuário o e-mail é imutável, então não é validado ali.

### 5.6 `src/config/database.ts`

```ts
import "dotenv/config";
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
```

O `pool` é um grupo de conexões reaproveitadas. Será usado pelos repositórios, e nenhuma outra camada fala com o banco.

---

## 6. Rota de login (contrato com o front-end)

| Método | Endereço | Autenticação |
|---|---|---|
| `POST` | `/api/auth/login` | Pública |

**Requisição** (`Content-Type: application/json`):

```json
{ "email": "usuario@email.com", "senha": "123456" }
```

**Respostas hoje:**

| Status | Quando | Corpo |
|---|---|---|
| `200` | e-mail válido e senha enviados | `{ "message": "Login recebido" }` |
| `400` | falta `email` ou `senha` | `{ "message": "E-mail e senha são obrigatórios" }` |
| `400` | e-mail com formato inválido | `{ "message": "E-mail inválido" }` |


### Como testar (Imsomnia)

`POST http://localhost:3333/api/auth/login`, aba **Body**, tipo **JSON**:

| Body | Esperado |
|---|---|
| `{ "email": "a@a.com", "senha": "123" }` | 200 |
| `{ "email": "a@a.com" }` | 400 |
| `{ "senha": "123" }` | 400 |
| `{ "email": "abc", "senha": "123" }` | 400 "E-mail inválido" |
| `{ "email": "a@a", "senha": "123" }` | 400 |
| sem corpo | 400 |

O JSON do teste é digitado no Thunder Client; ele simula o que o front enviará e não é arquivo do projeto.

---

## 7. Banco de dados no Docker

### 7.1 `docker-compose.yml`

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: brito-mysql
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/init:/docker-entrypoint-initdb.d

volumes:
  mysql_data:
```

| Item | Para que serve |
|---|---|
| `volumes: mysql_data` | Guarda os dados mesmo se o container for apagado |
| `./docker/init` | Todo `.sql` ali roda **uma vez**, na primeira criação do banco |
| `${...}` | Lê as variáveis do `.env`, sem repetir senhas no arquivo |

**YAML:** cada nível entra 2 espaços à direita do anterior, sem Tab, e listas usam `- ` (traço **e espaço**).

### 7.2 Comandos

| Ação | Comando |
|---|---|
| Subir | `docker compose up -d` |
| Ver estado | `docker compose ps` |
| Ver logs | `docker compose logs mysql --tail 20` |
| Listar tabelas | `docker exec -it brito-mysql mysql -u <usuario> -p <banco> -e "SHOW TABLES;"` |
| Parar (mantém dados) | `docker compose down` |
| Recriar do zero (apaga dados) | `docker compose down -v` e depois `docker compose up -d` |

No prompt `Enter password:` o terminal **não mostra** o que é digitado; isso é normal.

### 7.3 Carga inicial do banco

1. Exportar o banco antigo em `.sql` (phpMyAdmin: Exportar, formato SQL).
2. Salvar em `docker/init/`.
3. Subir o container. O MySQL executa o arquivo na primeira vez.

Observações:
- O `.sql` só roda com o volume **vazio**. Para refazer: `docker compose down -v` e `docker compose up -d`.
- O usuário e a senha são gravados **na primeira criação do volume**. Mudar o `.env` depois não altera o que já foi gravado.
- `DB_USER` não pode ser `root`.
- Não versionar dumps com dados reais de pessoas.
- O MySQL do XAMPP ocupa a mesma porta 3306; deve ficar desligado.

### 7.4 Situação

O container `brito-mysql` sobe, o `.sql` está em `docker/init/` e a conexão da API com o banco foi confirmada.

---

## 8. Como rodar o projeto do zero

Para qualquer pessoa da dupla, depois de clonar:

1. Instalar **Node.js** e o **Docker Desktop** (abrir e esperar `Engine running`).
2. Instalar as dependências:
   ```powershell
   npm install
   ```
3. Criar o `.env`: copiar o `.env.example`, renomear para `.env` e preencher os valores (cada pessoa define as próprias senhas).
4. Colocar o `.sql` em `docker/init/` (se ainda não estiver no repositório).
5. Subir o banco:
   ```powershell
   docker compose up -d
   docker compose ps
   ```
   Esperar uns 30 segundos até o MySQL terminar de iniciar (`docker compose logs mysql` mostra `ready for connections`).
6. Rodar a API:
   ```powershell
   npm run dev
   ```
   Deve aparecer `Servidor rodando na porta 3333`.
7. Testar a rota no Thunder Client (seção 6).
8. Verificação de tipos antes do commit:
   ```powershell
   npx tsc --noEmit
   ```

---

## 9. Decisões e motivos

| Decisão | Motivo |
|---|---|
| TypeScript com `strict` | Atende ao critério de tipagem sem `any` |
| Pastas por responsabilidade | SOLID e organização: cada peça é pequena e testável |
| `app.ts` separado de `server.ts` | Montar e ligar são tarefas diferentes |
| `tsx` em desenvolvimento, `tsc` no build | Rapidez no dia a dia; JavaScript compilado em produção |
| MySQL em Docker com volume | Mesmo ambiente para a dupla; dados persistem |
| `.env` ignorado e `.env.example` versionado | Segredos fora do Git, com modelo para a dupla |
| Validação de e-mail em `validators/` | Reaproveitada no login e no cadastro |