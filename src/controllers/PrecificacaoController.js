// controllers/PrecificacaoController.js
const Pricing = require("../models/Pricing");
const Product = require("../models/Product");

class PrecificacaoController {
  // Lista de precificações
  async index(req, res) {
    const precificacoes = await Pricing.find().sort({ createdAt: -1 });
    return res.render("precificacao/index", { precificacoes });
  }

  // Formulário para nova precificação
  async createForm(req, res) {
    const products = await Product.find().sort({ name: 1 });
    return res.render("precificacao/new", {
      products,
      defaultMargin: 70,
    });
  }

  // Recebe o POST com os dados da precificação
  async store(req, res) {
    try {
      const {
        productId,
        productName,
        margin,
        notes,
        // arrays dos itens
        itemType = [],
        itemName = [],
        itemUnit = [],
        itemPackageQty = [],
        itemPackageCost = [],
        itemUsedQty = [],
      } = req.body;

      const marginNumber = Number(margin) || 0;

      // Monta itens a partir dos arrays do form
      const items = [];
      let totalCost = 0;

      // Garantir que tudo é array
      const len = Array.isArray(itemName) ? itemName.length : (itemName ? 1 : 0);

      for (let i = 0; i < len; i++) {
        const name = Array.isArray(itemName) ? itemName[i] : itemName;
        if (!name) continue;

        const typeVal = Array.isArray(itemType) ? itemType[i] : itemType;
        const unitVal = Array.isArray(itemUnit) ? itemUnit[i] : itemUnit;
        const pkgQtyVal = Number(Array.isArray(itemPackageQty) ? itemPackageQty[i] : itemPackageQty) || 0;
        const pkgCostVal = Number(Array.isArray(itemPackageCost) ? itemPackageCost[i] : itemPackageCost) || 0;
        const usedQtyVal = Number(Array.isArray(itemUsedQty) ? itemUsedQty[i] : itemUsedQty) || 0;

        let usedCostVal = 0;
        if (pkgQtyVal > 0 && pkgCostVal > 0 && usedQtyVal > 0) {
          usedCostVal = (pkgCostVal / pkgQtyVal) * usedQtyVal;
        }

        totalCost += usedCostVal;

        items.push({
          type: typeVal || "INGREDIENTE",
          name,
          unit: unitVal,
          packageQty: pkgQtyVal,
          packageCost: pkgCostVal,
          usedQty: usedQtyVal,
          usedCost: usedCostVal,
        });
      }

      const suggestedPrice = totalCost * (1 + marginNumber / 100);

      const pricing = await Pricing.create({
        product: productId || null,
        productName: productName,
        margin: marginNumber,
        totalCost,
        suggestedPrice,
        notes,
        items,
      });

      return res.redirect(`/precificacoes/${pricing._id}`);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Erro ao salvar precificação");
    }
  }

  // Detalhe de uma precificação
  async show(req, res) {
    const pricing = await Pricing.findById(req.params.id);
    if (!pricing) {
      return res.status(404).send("Precificação não encontrada");
    }
    return res.render("precificacao/show", { pricing });
  }
}

module.exports = new PrecificacaoController();
