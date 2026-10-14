import { buildApp } from "./app";
import { env } from "./config/env";

const app = buildApp();

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then((endereco) => console.log(`Servidor rodando em ${endereco}`))
  .catch((erro) => {
    app.log.error(erro);
    process.exit(1);
  });
