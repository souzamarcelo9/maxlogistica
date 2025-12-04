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
    enum: ["200 ml", "300 ml", "500 ml", "700 ml", "1000 ml","200 g","300 g","500 g","700 g","1000 g","1 kg","2 kg","3 kg","4 kg","5 kg"], // lista fixa
    required: true,
  },
  items: [RecipeItemSchema], // ingredientes + quantidades  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
