import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config.js"; // Importamos la configuración con JWT_SECRET

// Extiende la interfaz Request para incluir la propiedad user
interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Middleware para autenticar JWT
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Extrae el token del header

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado." });
    }

    req.user = decoded as JwtPayload; // Almacena el usuario en la request
    next();
  });
};
