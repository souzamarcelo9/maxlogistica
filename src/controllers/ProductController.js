const moment = require("moment");
const formatCurrency = require("../lib/formatCurrency");
const Product = require("../models/Product");
const normalizePrice = require("../lib/normalizePrice");

class ProductController {
  create(req, res) {
    return res.render("product/register");
  }

  createUpdate(req, res) {
    return res.render("product/updateproduct");
  }

  async index(req, res) {
  try {
    const { nome, searchBarcode } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const filters = {};

    if (nome) {
      filters.name = new RegExp(nome, "i");
    }

    if (searchBarcode) {
      filters.barcode = searchBarcode;
    }

    // Consulta paginada usando paginate-v2
    const products = await Product.paginate(filters, {
      page,
      limit,
      sort: { createdAt: -1 },
    });

    // Formatação dos itens
    const finalProducts = products.docs.map((product) => {
      product.formattedExpirationDate = product.expirationDate
        ? moment(product.expirationDate).format("DD-MM-YYYY")
        : "";
      product.formattedSalePrice = formatCurrency.brl(product.salePrice);
      return product;
    });

    // Gerar array de páginas
    const pages = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pages.push(i);
    }

    return res.render("product/list", {
      products: finalProducts,
      currentPage: products.page,
      totalPages: products.totalPages,
      pages,
      nome: nome || "",
      searchBarcode: searchBarcode || "",
      filterActive: !!(nome || searchBarcode),
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao carregar produtos.");
  }
}

  async store(req, res) {
    const { name, salePrice, amount, expirationDate, barcode } = req.body;

    if (!name || !salePrice || !amount) {
      let products = await Product.find();

      const getProductsPromise = products.map(async (product) => {
        product.formattedExpirationDate = moment(product.expirationDate).format(
          "DD-MM-YYYY"
        );
        product.formattedPrice = formatCurrency.brl(product.price);
        product.formattedSalePrice = formatCurrency.brl(product.salePrice);
        return product;
      });

      products = await Promise.all(getProductsPromise);

      return res.render("product/list", {
        name,
        salePrice,
        amount,
        barcode,
        products: products,
        expirationDate: moment(expirationDate).format("YYYY-MM-DD"),
        message: "Preencha os campos obrigatórios (*) para continuar!",
      });
    }

    /* await Product.create({
      ...req.body,
      expirationDate: !req.body.expirationDate
        ? null
        : moment(req.body.expirationDate).format(),
    }); */
    // Normalizar preço antes de salvar
    const salePriceNormalized = normalizePrice(req.body.salePrice);

    await Product.create({
      ...req.body,
      salePrice: salePriceNormalized,
      expirationDate: !req.body.expirationDate
        ? null
        : moment(req.body.expirationDate).format(),
    });

    return res.redirect("/productslist");
  }

  async edit(req, res) {
    const { id } = req.params;

    let product = await Product.findById(id);

    product.formattedExpirationDate = moment(product.expirationDate).format(
      "YYYY-MM-DD"
    );

    return res.render("product/update", {
      product: product,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, salePrice, amount } = req.body;

    if (!name || !salePrice || !amount) {
      let product = await Product.findById(id);

      product.formattedExpirationDate = moment(product.expirationDate).format(
        "YYYY-MM-DD"
      );

      return res.render("product/update", {
        product: product,
        message: "Preencha os campos obrigatórios (*) para continuar!",
      });
    }

    /* await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        expirationDate: !req.body.expirationDate
          ? null
          : moment(req.body.expirationDate).format(),
      },
        { new: true }
      ); */
    const salePriceNormalized = normalizePrice(req.body.salePrice);

    await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        salePrice: salePriceNormalized,
        expirationDate: !req.body.expirationDate
          ? null
          : moment(req.body.expirationDate).format(),
      },
        { new: true }
      );

    return res.redirect("/productslist");
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Product.findByIdAndRemove(id);

    return res.redirect("/productslist");
  }
}

module.exports = new ProductController();
