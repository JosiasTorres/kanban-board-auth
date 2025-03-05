const forceDatabaseRefresh = false;
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // 🔥 Agregado para __dirname
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
// 🔥 Solución para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
// Serves static files in the client's dist folder
app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.use(express.json());
app.use(routes);
// Sync con la base de datos y manejo de errores
sequelize
    .sync({ force: forceDatabaseRefresh })
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Error connecting to the database:", error);
});
