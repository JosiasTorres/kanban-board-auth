import jwt from "jsonwebtoken";
import { config } from "../config.js"; // Importamos la configuración con JWT_SECRET
// Middleware para autenticar JWT
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extrae el token del header
    if (!token) {
        res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
        return;
    }
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Token inválido o expirado." });
            return;
        }
        // Agregar los datos del usuario al request para su uso en las rutas protegidas
        req.user = decoded;
        next();
        return; // 🔹 Asegura que la función siempre termina correctamente
    });
};
