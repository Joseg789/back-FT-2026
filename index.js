import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import viajesRoutes from "./routes/viajesRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/viajes", viajesRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
