import { Router } from "express";
import authRoutes from "./auth-routes.js"; // Rutas públicas (login y registro)
import apiRoutes from "./api/index.js"; // Rutas de la API protegidas
import { authenticateToken } from "../middleware/auth.js"; // Middleware de autenticación

const router: Router = Router();

// 🔓 Rutas públicas (login y registro)
router.use("/auth", authRoutes);

// 🔒 Rutas protegidas con autenticación JWT
router.use("/api", authenticateToken, apiRoutes);

export default router;
