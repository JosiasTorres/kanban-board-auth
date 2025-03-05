import { Router } from "express";
import authRoutes from "./auth-routes.js";
import apiRoutes from "./api/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Rutas públicas (autenticación y registro)
router.use("/auth", authRoutes);

// 🔒 Protegemos todas las rutas de la API con JWT
router.use("/api", authenticateToken, apiRoutes);

export default router;
