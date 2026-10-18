import { buildApp } from "./app";
import { env } from "./config/env";

const app = buildApp();

const servidor = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});

servidor.on("error", (erro) => {
  console.error(erro);
  process.exit(1);
});
