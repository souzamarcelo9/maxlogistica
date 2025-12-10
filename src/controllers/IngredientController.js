const Ingredient = require("../models/Ingredient");

class IngredientController {
  async index(req, res) {
    const page = parseInt(req.query.page) || 1;

    const { docs, totalPages, page: currentPage } =
      await Ingredient.paginate({}, { 
        sort: { name: 1 },
        page,
        limit: 10
      });

    return res.render("ingredient/list", {
      ingredients: docs,
      totalPages,
      currentPage
    });
  }

  async createForm(req, res) {
    return res.render("ingredient/new");
  }

  async store(req, res) {
    const { name, type, unit, packageQty, packageCost } = req.body;

    await Ingredient.create({ name, type, unit, packageQty, packageCost });

    return res.redirect("/ingredients");
  }

  async delete(req, res) {
    const { id } = req.params;
    await Ingredient.findByIdAndDelete(id);
    return res.redirect("/ingredients");
  }
}

module.exports = new IngredientController();
