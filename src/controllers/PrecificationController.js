// controllers/PrecificationController.js
const Product = require("../models/Product");
const Recipe = require("../models/Recipe");
const Precification = require("../models/Precification");
const FixedCost = require("../models/FixedCost");

// base de produção estimada por mês 
const FIXED_COST_BASE_UNITS = 2000; 
const PDFDocument = require("pdfkit");

class PrecificationController {

  //--------------------------------------------------------
  // FORMULÁRIO NOVA PRECIFICAÇÃO
  //--------------------------------------------------------
  async createForm(req, res) {
  const products = await Product.find().sort({ name: 1 });

  const recipes = await Recipe.find()
    .populate("product")
    .populate("items.ingredient");

  const recipesJson = JSON.stringify(
    recipes.map((r) => ({
      id: String(r._id),
      productId: String(r.product._id),
      productName: r.product.name,
      size: r.size,
      items: r.items.map((it) => ({
        ingredientId: String(it.ingredient._id),
        name: it.ingredient.name,
        type: it.ingredient.type,
        unit: it.ingredient.unit,
        packageQty: it.ingredient.packageQty,
        packageCost: it.ingredient.packageCost,
        usedQty: it.usedQty,
      })),
    }))
  );

  // Cálculo do rateio de custos fixos
  let fixedCostPerUnit = 0;
  try {
    const agg = await FixedCost.aggregate([
      { $group: { _id: null, total: { $sum: "$monthlyValue" } } },
    ]);

    const totalFixed = agg.length ? agg[0].total : 0;

    if (FIXED_COST_BASE_UNITS > 0 && totalFixed > 0) {
      fixedCostPerUnit = totalFixed / FIXED_COST_BASE_UNITS;
    }
  } catch (e) {
    fixedCostPerUnit = 0;
  }

  // Caso seja duplicação
  if (req.query.duplicate) {
    const prec = await Precification.findById(req.query.duplicate);
    if (!prec) return res.redirect("/precificacoes");

    return res.render("precificacoes/new", {
      products,
      defaultMargin: prec.margin,
      duplicateData: prec,
      recipesJson,
      fixedCostPerUnit,
    });
  }

  // Nova precificação normal
  return res.render("precificacoes/new", {
    products,
    recipesJson,
    defaultMargin: 70,
    fixedCostPerUnit,
  });
 }

  //--------------------------------------------------------
  // SALVAR PRECIFICAÇÃO
  //--------------------------------------------------------
  async store(req, res) {
    const {
      productId,
      productName,
      margin,
      size,
      totalCost,
      suggestedPrice,
      notes,
      recipeId,
    } = req.body;

    // Arrays dos itens
    let {
      itemType,
      itemName,
      itemUnit,
      itemPackageQty,
      itemPackageCost,
      itemUsedQty,
      itemUsedCost,
    } = req.body;

    function normalizeArray(val) {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }

    itemType = normalizeArray(itemType);
    itemName = normalizeArray(itemName);
    itemUnit = normalizeArray(itemUnit);
    itemPackageQty = normalizeArray(itemPackageQty);
    itemPackageCost = normalizeArray(itemPackageCost);
    itemUsedQty = normalizeArray(itemUsedQty);
    itemUsedCost = normalizeArray(itemUsedCost);

    const itemsSnapshot = itemName.map((name, idx) => ({
      ingredientName: name,
      type: itemType[idx],
      unit: itemUnit[idx],
      packageQty: Number(itemPackageQty[idx] || 0),
      packageCost: Number(itemPackageCost[idx] || 0),
      usedQty: Number(itemUsedQty[idx] || 0),
      usedCost: Number(itemUsedCost[idx] || 0),
    }));

    await Precification.create({
      recipe: recipeId,
      product: productId || null,
      productName,
      size,
      margin: Number(margin || 0),
      totalCost: Number(totalCost || 0),
      suggestedPrice: Number(suggestedPrice || 0),
      notes,
      itemsSnapshot,
    });

    return res.redirect("/precificacoes");
  }

  //--------------------------------------------------------
  // LISTAGEM
  //--------------------------------------------------------
  async index(req, res) {
    const search = req.query.search || "";

    let filter = {};
    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }

    const precs = await Precification.find(filter)
      .sort({ createdAt: -1 });

    return res.render("precificacoes/index", {
      precificacoes: precs,
      search
    });
  }

  //--------------------------------------------------------
  // DETALHES DA PRECIFICAÇÃO (SHOW)
  //--------------------------------------------------------
  async show(req, res) {
  const prec = await Precification.findById(req.params.id)
    .populate("recipe")
    .populate("product");

  if (!prec) return res.redirect("/precificacoes");

  // Snapshot dos itens
  const items = prec.itemsSnapshot;

  // ⚠️ Manda JSON válido PRONTO para o front
  const itemsJson = JSON.stringify(items);

  return res.render("precificacoes/show", {
    precificacao: prec,
    items,
    itemsJson // <- Aqui!
  });
}

  //--------------------------------------------------------
  // DUPLICAR PRECIFICAÇÃO
  //--------------------------------------------------------
  async duplicate(req, res) {
    return res.redirect(`/precificacoes/new?duplicate=${req.params.id}`);
  }

  //--------------------------------------------------------
  // GERAR PDF
  //--------------------------------------------------------
  async generatePDF(req, res) {
    const prec = await Precification.findById(req.params.id);
    if (!prec) return res.status(404).send("Precificação não encontrada.");

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=precificacao-${prec._id}.pdf`);

    doc.pipe(res);

    // Título
    doc.fontSize(20).text("Ficha de Precificação", { align: "center" });
    doc.moveDown();

    // Dados principais
    doc.fontSize(12)
      .text(`Produto: ${prec.productName}`)
      .text(`Tamanho: ${prec.size}`)
      .text(`Margem: ${prec.margin}%`)
      .text(`Custo total: R$ ${prec.totalCost.toFixed(2)}`)
      .text(`Preço sugerido: R$ ${prec.suggestedPrice.toFixed(2)}`);

    doc.moveDown().text("Itens:", { underline: true }).moveDown(0.5);

    prec.itemsSnapshot.forEach(item => {
      doc.text(
        `${item.ingredientName} - ${item.usedQty}${item.unit} → R$ ${item.usedCost.toFixed(2)}`
      );
    });

    doc.end();
  }

  async delete(req, res) {
  try {
    await Precification.findByIdAndDelete(req.params.id);
    return res.redirect("/precificacoes");
  } catch (err) {
    console.error(err);
    return res.redirect("/precificacoes");
  }
}

}

module.exports = new PrecificationController();
