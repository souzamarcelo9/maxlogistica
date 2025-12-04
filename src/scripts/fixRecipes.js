// scripts/fixRecipes.js
const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
async function run() {
  console.log("🔍 Corrigindo receitas...");

  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const recipes = await Recipe.find().populate("items.ingredient");

  let updated = 0;
  let removed = 0;

  for (const recipe of recipes) {
    const originalCount = recipe.items.length;

    // Remove itens quebrados (ingrediente null)
    recipe.items = recipe.items.filter((item) => item.ingredient);

    if (recipe.items.length !== originalCount) {
      updated++;
      await recipe.save();
      console.log(`✔ Ajustado: ${recipe._id} - itens corrigidos`);
    }

    // Se receita ficou sem itens → remover (opcional)
    if (recipe.items.length === 0) {
      removed++;
      await Recipe.deleteOne({ _id: recipe._id });
      console.log(`⚠ Removida receita vazia: ${recipe._id}`);
    }
  }

  console.log("\n🎉 Correção concluída!");
  console.log(`Receitas ajustadas: ${updated}`);
  console.log(`Receitas removidas: ${removed}`);

  mongoose.disconnect();
}

run().catch(console.error);
