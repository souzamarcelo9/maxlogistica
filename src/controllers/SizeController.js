const Size = require("../models/Size");

class SizeController {

  async index(req, res) {
    const sizes = await Size.find().sort({ quantity: 1 });
    return res.render("sizes/index", { sizes });
  }

  createForm(req, res) {
    return res.render("sizes/new");
  }

  async store(req, res) {
    const { label, unit, quantity } = req.body;

    if (!label || !unit || !quantity) {
      return res.render("sizes/new", {
        message: "Preencha todos os campos.",
        label, unit, quantity
      });
    }

    await Size.create({ label, unit, quantity });

    return res.redirect("/sizes");
  }

  async delete(req, res) {
    const { id } = req.params;
    await Size.findByIdAndDelete(id);
    return res.redirect("/sizes");
  }
}

module.exports = new SizeController();
