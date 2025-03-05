import { Router } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config.js"; // Importamos la clave secreta del JWT
const router = Router();
// Función para manejar el login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validar que se enviaron credenciales
        if (!username || !password) {
            return res.status(400).json({ message: "Usuario y contraseña requeridos." });
        }
        // Buscar el usuario en la base de datos
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        // Verificar la contraseña con bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        // Generar el token JWT
        const token = jwt.sign({ username: user.username }, config.jwtSecret, { expiresIn: "1h" });
        return res.json({ token });
    }
    catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
// POST /login - Login de usuario
router.post("/login", login);
export default router;
