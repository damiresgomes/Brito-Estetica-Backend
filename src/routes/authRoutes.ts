import { Router } from "express";
import { AuthController } from "../controllers/authController";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (request, response) => authController.login(request, response));

export default authRoutes;