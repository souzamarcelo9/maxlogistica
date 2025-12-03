// models/Recipe.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeItemSchema = new Schema({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  usedQty: {
    type: Number, // quanto desse insumo entra nessa variação
    required: true,
  },
});

const RecipeSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product", // produto final (ex: "Açaí Gourmet")
    required: true,
  },
  size: {
    type: String,
    enum: ["200 ml", "300 ml", "500 ml", "700 ml", "1000 ml"], // lista fixa que você pediu
    required: true,
  },
  items: [RecipeItemSchema], // ingredientes + quantidades

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
