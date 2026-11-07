# Autenticação de clientes e administradores

## Migração de bancos existentes

Faça um backup antes de alterar o banco. A migração não apaga nem recria tabelas:

```powershell
mysqldump -h localhost -u SEU_USUARIO -p britoestetica > backup-antes-autenticacao.sql
Get-Content -Raw .\migrations\20261105_contas_acesso.sql | mysql -h localhost -u SEU_USUARIO -p britoestetica
```

Execute a migração uma vez depois de conferir o backup e antes de iniciar a nova
versão da API. Ela cria `contas_acesso` e copia para essa tabela os e-mails,
hashes e estados de `usuario`, preservando o vínculo como `admin`. O esquema
anterior não guardava um papel por funcionário; por isso todos os registros
existentes em `usuario` são tratados como contas administrativas. A inserção
usa `INSERT IGNORE` e não substitui contas que já existam.

Para instalações novas, `docker\init\brito_estetica.sql` já cria a tabela e
prepara os acessos administrativos iniciais.

## Endpoints e fluxo

- `POST /api/auth/cadastro-cliente`: cadastro público com `nome`, `email`,
  `senha` e `telefone`. O papel é definido pelo servidor como `cliente`; campos
  extras como `papel` são rejeitados.
- `POST /api/auth/login`: recebe `email` e `senha`; responde com `token` e um
  objeto `usuario` contendo somente `id`, `nome`, `email` e `papel`.
- `GET /api/auth/me`: perfil da conta autenticada.
- `POST /api/auth/logout`: revoga a sessão do token atual.
- `GET /api/servicos/listar` permanece público. As operações administrativas
  de serviços e todas as rotas de `/api/usuarios` exigem papel `admin`.
- `/api/agendamentos/*` exige sessão autenticada de cliente. O agendamento é
  associado ao registro de cliente vinculado à conta, e não a um ID enviado
  pelo navegador.

Exemplo de cadastro e login:

```json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@example.com",
  "senha": "SenhaForte#123",
  "telefone": "(19) 98888-0001"
}
```

```json
{
  "email": "cliente@example.com",
  "senha": "SenhaForte#123"
}
```

Envie o token nas rotas protegidas como `Authorization: Bearer <token>`.
Cadastros administrativos continuam em `POST /api/usuarios/cadastro`, agora
restrito a um administrador autenticado; os dados administrativos existentes
continuam válidos depois do backfill.

## Teste manual

Com o servidor e o banco atualizados, use o cliente REST de sua preferência:

1. Cadastre um cliente em `POST /api/auth/cadastro-cliente`; confirme `201`.
2. Tente cadastrar o mesmo e-mail; confirme `409`.
3. Faça login com a conta recém-criada; confirme que o papel retornado é
   `cliente` e que não há senha/hash na resposta.
4. Consulte `GET /api/servicos/listar` sem token; deve continuar respondendo.
5. Tente acessar `/api/usuarios/listar` e operações de escrita de serviços sem
   token; confirme `401`.
6. Repita essas rotas com o token do cliente; confirme `403`.
7. Acesse `/api/agendamentos/horarios` e faça um agendamento com o token do
   cliente; confirme que exige autenticação e grava o `id_cliente` vinculado.
8. Faça login com uma conta administrativa antiga e confirme acesso às rotas
   administrativas. Finalize com `POST /api/auth/logout` e confirme que o token
   revogado não pode ser usado novamente.

O workspace desta aplicação contém somente o backend. A tela do site deve
redirecionar visitantes sem sessão de `/agendamento` para `/login`, exibir o
link para cadastro e, após um `201`, retornar ao login com a confirmação; depois
do login, deve direcionar `admin` ao painel e `cliente` ao site. O servidor
valida o papel em todas as rotas protegidas independentemente desses controles
de interface.
