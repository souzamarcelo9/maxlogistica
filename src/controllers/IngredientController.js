// controllers/IngredientController.js
const Ingredient = require("../models/Ingredient");

class IngredientController {
  async index(req, res) {
    const ingredients = await Ingredient.find().sort({ name: 1 });

    return res.render("ingredient/list", {
      ingredients,
    });
  }

  async createForm(req, res) {
    return res.render("ingredient/new");
  }

  async store(req, res) {
    const { name, type, unit, packageQty, packageCost } = req.body;

    await Ingredient.create({
      name,
      type,
      unit,
      packageQty,
      packageCost,
    });

    return res.redirect("/ingredients");
  }

  async delete(req, res) {
    const { id } = req.params;
    await Ingredient.findByIdAndDelete(id);
    return res.redirect("/ingredients");
  }
}

module.exports = new IngredientController();
