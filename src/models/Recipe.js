// models/Recipe.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeItemSchema = new Schema({
  ingredient: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient",
      required: [true, "Item da receita sem ingrediente vinculado!"]
    },
    usedQty: {
      type: Number,
      required: true,
      min: [0, "Quantidade usada não pode ser negativa"]
    }
});

const RecipeSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product", // produto final (ex: "Açaí Gourmet")
    required: true,
  },
  size: {
    type: String,
    enum: ["1 un","200 ml", "300 ml", "500 ml", "700 ml", "1000 ml","200 g","300 g","500 g","700 g","1000 g","1 kg","2 kg","3 kg","4 kg","5 kg"], // lista fixa
    required: true,
  },
  items: [RecipeItemSchema], // ingredientes + quantidades  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

RecipeSchema.pre("validate", function (next) {
  if (!this.items || this.items.length === 0) {
    return next(new Error("A receita precisa ter pelo menos 1 ingrediente."));
  }

  for (const item of this.items) {
    if (!item.ingredient) {
      return next(new Error("Um item da receita está sem ingrediente vinculado."));
    }
  }

  next();
});

module.exports = mongoose.model("Recipe", RecipeSchema);
