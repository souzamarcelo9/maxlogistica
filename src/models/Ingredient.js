// models/Ingredient.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["INGREDIENTE", "INSUMO", "MAO_DE_OBRA"],
    default: "INGREDIENTE",
  },
  unit: {
    type: String, // "g", "ml", "un", "hora", etc.
    required: true,
  },
  packageQty: {
    type: Number, // quantos gramas/ml/unidades tem o pacote
    required: true,
  },
  packageCost: {
    type: Number, // custo do pacote inteiro
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ingredient", IngredientSchema);
