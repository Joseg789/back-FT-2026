/**
 * seed.js — Importa los 73 viajes del catálogo 2026 en MongoDB
 *
 * Uso:
 *   MONGO_URI=mongodb://localhost:27017/viajes2026 node seed/seed.js
 *   (si no se pasa MONGO_URI usa mongodb://localhost:27017/viajes2026 por defecto)
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Viaje from "../models/Viaje.js";
import connectDB from "../config/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { viajes } from "./dataViajes.js";
dotenv.config();

const DATA_PATH = path.join(__dirname, "dataViajes.js");

async function seed() {
  await connectDB();

  // Limpia la colección antes de insertar
  await Viaje.deleteMany({});
  console.log("  Colección viajes vaciada");

  const inserted = await Viaje.insertMany(viajes, { ordered: false });
  console.log(` Insertados ${inserted.length} viajes`);

  // Resumen por continente
  const resumen = await Viaje.aggregate([
    {
      $group: {
        _id: "$continente",
        total: { $sum: 1 },
        precioMedio: { $avg: "$precioHabDoble" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  console.log("\n Resumen por continente:");
  resumen.forEach((r) =>
    console.log(
      `   ${r._id}: ${r.total} viajes | precio medio hab. doble: ${r.precioMedio ? r.precioMedio.toFixed(0) + " €" : "N/A"}`,
    ),
  );

  await mongoose.disconnect();
  console.log("Conexión cerrada");
}

//si hay error
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
