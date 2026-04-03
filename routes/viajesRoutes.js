import { Router } from "express";
import {
  getViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje,
} from "../controllers/viajes.controller.js";

const router = Router();
// GET/api/viajesListar todos (con filtros)
router.get("/", getViajes);
// GET/api/viajes/:idObtener uno por ID
router.get("/:id", getViajeById);
// POST/api/viajesCrear nuevo viaje
router.post("/", createViaje);
// PUT/api/viajes/:idActualizar viaje
router.put("/:id", updateViaje);

router.delete("/:id", deleteViaje);

export default router;
