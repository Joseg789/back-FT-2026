import mongoose from "mongoose";

const ViajeSchema = new mongoose.Schema(
  {
    continente: {
      type: String,
      required: true,
      enum: ["EUROPA", "ASIA", "AFRICA", "AMERICA"],
      index: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    tipologia: {
      type: String,
      enum: ["plaza_a_plaza_en_grupo", "plaza_a_plaza", "cupo"],
      default: null,
    },

    dias: {
      type: Number,
      min: 1,
    },

    fechas: {
      type: String, // texto libre: "14 de Junio, 12 de Julio, ..."
      trim: true,
    },

    mes: {
      type: String,
      trim: true,
    },

    ciudadSalida: {
      type: String,
      enum: ["Valencia", "Madrid", "Madrid/Valencia"],
      default: null,
    },

    precioHabDoble: {
      type: Number,
      min: 0,
    },

    precioIndividual: {
      type: Number,
      min: 0,
    },

    proveedor: {
      type: String,
      trim: true,
      index: true,
    },

    linkWeb: {
      type: String,
      trim: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "viajes",
  },
);

// Índice compuesto para búsquedas frecuentes
ViajeSchema.index({ continente: 1, mes: 1 });
ViajeSchema.index({ continente: 1, precioHabDoble: 1 });

// Virtual: margen precio individual vs doble
ViajeSchema.virtual("margenIndividual").get(function () {
  if (this.precioIndividual && this.precioHabDoble) {
    return +(this.precioIndividual - this.precioHabDoble).toFixed(2);
  }
  return null;
});

// Método de instancia: resumen
ViajeSchema.methods.resumen = function () {
  return `${this.nombre} (${this.continente}) — ${this.dias} días — desde ${this.precioHabDoble ?? "N/A"} €`;
};

// Método estático: buscar por continente y precio máximo
ViajeSchema.statics.porContinenteYPresupuesto = function (
  continente,
  maxPrecio,
) {
  return this.find({
    continente,
    precioHabDoble: { $lte: maxPrecio },
    activo: true,
  }).sort({ precioHabDoble: 1 });
};

export default mongoose.model("Viaje", ViajeSchema);
