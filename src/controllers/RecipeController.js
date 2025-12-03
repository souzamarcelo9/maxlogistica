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

    return res.render("recipe/list", { recipes });
  }

  async createForm(req, res) {
    const products = await Product.find().sort({ name: 1 });
    const ingredients = await Ingredient.find().sort({ name: 1 });

    return res.render("recipe/new", {
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
}

module.exports = new RecipeController();
