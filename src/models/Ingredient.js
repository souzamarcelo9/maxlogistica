const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["INGREDIENTE", "INSUMO", "MAO_DE_OBRA"],
    default: "INGREDIENTE",
  },
  unit: { type: String, required: true },
  packageQty: { type: Number, required: true },
  packageCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// 👉 ADICIONAR PAGINAÇÃO
IngredientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Ingredient", IngredientSchema);