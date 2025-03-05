import { Router, Request, Response } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config.js";

const router = Router();

// Función para manejar el login
export const login = async (req: Request, res: Response) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    if (!username || !password || typeof password !== "string") {
      return res.status(400).json({ message: "Usuario y contraseña requeridos." });
    }

    // 🔍 Buscar usuario en la base de datos asegurando que incluya el password
    const user = await User.findOne({
      where: { username },
      attributes: ["id", "username", "password"], // 🔥 Asegurar que el password es incluido
      raw: true // 🔥 Extrae los datos sin envolver en un objeto Sequelize
    });

    console.log("🔎 Usuario encontrado en BD:", user);

    if (!user || !user.password) {
      console.warn("⚠️ Usuario no encontrado o sin contraseña en BD:", username);
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    console.log("🔍 Password en BD:", `"${user.password}"`);
    console.log("🔍 Password ingresado:", `"${password}"`);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Contraseña incorrecta para usuario:", username);
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    try {
      const token = jwt.sign(
        { username: user.username, id: user.id },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      console.log("✅ Login exitoso:", username);
      return res.json({ token });
    } catch (jwtError) {
      console.error("❌ Error generando JWT:", jwtError);
      return res.status(500).json({ message: "Error al generar token." });
    }
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// POST /login - Login de usuario
router.post("/login", login);

export default router;
