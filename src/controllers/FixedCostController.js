const FixedCost = require("../models/FixedCost");

class FixedCostController {
  // Lista todos os custos fixos
  async index(req, res) {
    const costs = await FixedCost.find().sort({ createdAt: -1 });

    const total = costs.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);

    return res.render("fixedcosts/index", {
      costs,
      total,
    });
  }

  // Formulário novo custo
  createForm(req, res) {
    return res.render("fixedcosts/new");
  }

  // Salvar novo custo
  async store(req, res) {
    const { name, monthlyValue } = req.body;

    // converte "1.234,56" para número
    const numeric = Number(
      String(monthlyValue).replace(".", "").replace(",", ".")
    ) || 0;

    await FixedCost.create({
      name,
      monthlyValue: numeric,
    });

    return res.redirect("/fixedcosts");
  }

  // Formulário de edição
  async editForm(req, res) {
    const cost = await FixedCost.findById(req.params.id);
    if (!cost) {
      return res.redirect("/fixedcosts");
    }

    return res.render("fixedcosts/edit", { cost });
  }

  // Atualizar custo
  async update(req, res) {
    const { name, monthlyValue } = req.body;

    const numeric = Number(
      String(monthlyValue).replace(".", "").replace(",", ".")
    ) || 0;

    await FixedCost.findByIdAndUpdate(req.params.id, {
      name,
      monthlyValue: numeric,
    });

    return res.redirect("/fixedcosts");
  }

  // Deletar
  async delete(req, res) {
    await FixedCost.findByIdAndDelete(req.params.id);
    return res.redirect("/fixedcosts");
  }
}

module.exports = new FixedCostController();
