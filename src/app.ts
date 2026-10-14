import express from "express";
import authRoutes from "./routes/authRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);

export default app;