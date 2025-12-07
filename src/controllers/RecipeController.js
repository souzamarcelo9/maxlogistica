// controllers/RecipeController.js
const Recipe = require("../models/Recipe");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");

class RecipeController {
  async index(req, res) {
    const recipes = await Recipe.find()
      .populate("product")
      .populate("items.ingredient")
      .sort({ createdAt: -1 });

      //console.log(recipes);

    return res.render("recipes/list", { recipes });
  }

  async createForm(req, res) {
    const products = await Product.find().sort({ name: 1 });
    const ingredients = await Ingredient.find().sort({ name: 1 });

    return res.render("recipes/new", {
      products,
      ingredients,
    });
  }

  async store(req, res) {
    const { productId, size } = req.body;
    let { ingredientId, usedQty } = req.body;

    // Normaliza para arrays
    if (!Array.isArray(ingredientId)) {
      ingredientId = ingredientId ? [ingredientId] : [];
      usedQty = usedQty ? [usedQty] : [];
    }

    const items = [];

    ingredientId.forEach((ingId, idx) => {
      if (ingId && usedQty[idx]) {
        items.push({
          ingredient: ingId,
          usedQty: Number(usedQty[idx]),
        });
      }
    });

    await Recipe.create({
      product: productId,
      size,
      items,
    });

    return res.redirect("/recipes");
  }

  async delete(req, res) {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    return res.redirect("/recipes");
  }

  
  async editForm(req, res) {
    const id = req.params.id;

    const recipe = await Recipe.findById(id)
      .populate("product")
      .populate("items.ingredient")
      .lean(); // <- importante: vira objeto “puro”

    if (!recipe) {
      
      return res.redirect("/recipes");
    }

    const ingredients = await Ingredient.find().sort({ name: 1 }).lean();

    const recipeJson = JSON.stringify(recipe);

    return res.render("recipes/edit", {
      recipe,
      ingredients,
      recipeJson,
    });
  }

  // --- NOVO: SALVAR EDIÇÃO ---
  async update(req, res) {
    const { id } = req.params;
    let { ingredientId, usedQty } = req.body;

    function toArray(val) {
      return Array.isArray(val) ? val : [val];
    }

    ingredientId = toArray(ingredientId);
    usedQty = toArray(usedQty);

    const items = ingredientId.map((id, idx) => ({
      ingredient: id,
      usedQty: Number(usedQty[idx] || 0),
    }));

    await Recipe.findByIdAndUpdate(id, {
      items
    });

    return res.redirect("/recipes");
  }
}

module.exports = new RecipeController();
