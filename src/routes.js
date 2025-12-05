const express = require("express");

const UserController = require("./controllers/UserController");
const CategoryController = require("./controllers/CategoryController");
const ProductController = require("./controllers/ProductController");
const ProductSoldController = require("./controllers/ProductSoldController");
const CartController = require("./controllers/CartController");
const SaleController = require("./controllers/SaleController");
const ExitController = require("./controllers/ExitController");
const EntranceController = require("./controllers/EntranceController");
const EntranceAndExitController = require("./controllers/EntranceAndExitController");
const SessionController = require("./controllers/SessionController");
const PrecificacaoController = require("./controllers/PrecificacaoController");
const IngredientController = require("./controllers/IngredientController");
const RecipeController = require("./controllers/RecipeController");
const PrecificationController = require("./controllers/PrecificationController");
const FixedCostController = require("./controllers/FixedCostController");
const SizeController = require("./controllers/SizeController");

const middleware = require("./middlewares/session");
const session = require("express-session");

const routes = express.Router();

routes.get("/login", SessionController.loginForm);
routes.post("/logout", SessionController.logout);
routes.post("/session", SessionController.store);

routes.use(middleware);

routes.get("/", (req, res) => {
  return res.render("home/index");
});

routes.get("/userslist", UserController.index);
routes.get("/users", UserController.create);
routes.post("/users", UserController.store);
routes.get("/users/edit/:id", UserController.edit);
routes.put("/users/edit/:id", UserController.update);
routes.delete("/users/delete/:id", UserController.destroy);

routes.get("/categoryslist", CategoryController.index);
routes.get("/categorys", CategoryController.create);
routes.post("/categorys", CategoryController.store);
routes.get("/categorys/edit/:id", CategoryController.edit);
routes.put("/categorys/edit/:id", CategoryController.update);
routes.delete("/categorys/delete/:id", CategoryController.destroy);

routes.get("/productslist", ProductController.index);
//routes.post("/productslist", ProductController.index);
routes.get("/products", ProductController.create);
routes.post("/products", ProductController.store);
routes.get("/products/edit/:id", ProductController.edit);
routes.put("/products/edit/:id", ProductController.update);
routes.delete("/products/delete/:id", ProductController.destroy);

routes.get("/productssoldslist", ProductSoldController.indexProduct);

routes.get("/cart", CartController.index);
routes.post("/cart", CartController.index);
routes.post("/cart/add-one/:id", CartController.addOne);
routes.post("/cart/remove-one/:id", CartController.removeOne);
routes.post("/cart/delete/:id", CartController.delete);

routes.post("/sales", SaleController.store);
routes.get("/sales", SaleController.index);
routes.post("/salesdates", SaleController.index);
routes.delete("/sales/delete/:id", SaleController.destroy);
routes.delete("/sales/deleteall", SaleController.destroyAll);

routes.get("/exits", ExitController.index);
routes.post("/exitsdates", ExitController.index);
routes.get("/exits", ExitController.index);
routes.post("/exits", ExitController.store);
routes.get("/exits/edit/:id", ExitController.edit);
routes.put("/exits/edit/:id", ExitController.update);
routes.delete("/exits/delete/:id", ExitController.destroy);

//precificação
// INGREDIENTS
routes.get("/ingredients", IngredientController.index);
routes.get("/ingredients/new", IngredientController.createForm);
routes.post("/ingredients", IngredientController.store);
routes.post("/ingredients/delete/:id", IngredientController.delete);

// RECIPES (fichas técnicas)
routes.get("/recipes", RecipeController.index);
routes.get("/recipes/new", RecipeController.createForm);
routes.post("/recipes", RecipeController.store);
routes.post("/recipes/delete/:id", RecipeController.delete);

// PRECIFICAÇÕES
routes.get("/precificacoes", PrecificationController.index);
routes.get("/precificacoes/new", PrecificationController.createForm);
routes.post("/precificacoes", PrecificationController.store);
// Listar precificações
//routes.get("/precificacoes", session, PrecificacaoController.index);

// Formulário nova precificação
//routes.get("/precificacoes/new", middleware, PrecificacaoController.createForm);

// Salvar
//routes.post("/precificacoes", middleware, PrecificacaoController.store);

// Detalhe
//routes.get("/precificacoes/:id", middleware, PrecificacaoController.show);
// Duplicar
routes.get("/precificacoes/duplicate/:id", PrecificationController.duplicate);
// Show (detalhes)
routes.get("/precificacoes/:id", PrecificationController.show);
// PDF
routes.get("/precificacoes/:id/pdf", PrecificationController.generatePDF);
routes.delete("/precificacoes/delete/:id", PrecificationController.delete);

routes.get("/entrances", EntranceController.index);
routes.post("/entrancesdate", EntranceController.index);

routes.get("/entrancesandexitsdatails", EntranceAndExitController.index);
routes.post("/entrancesandexitsdatailsdates", EntranceAndExitController.index);

// CUSTOS FIXOS
routes.get("/fixedcosts", FixedCostController.index);
routes.get("/fixedcosts/new", FixedCostController.createForm);
routes.post("/fixedcosts", FixedCostController.store);
routes.get("/fixedcosts/edit/:id", FixedCostController.editForm);
routes.post("/fixedcosts/edit/:id", FixedCostController.update);
routes.post("/fixedcosts/delete/:id", FixedCostController.delete);

// SIZES (tamanhos padrão)
routes.get("/sizes", SizeController.index);
routes.get("/sizes/new", SizeController.createForm);
routes.post("/sizes", SizeController.store);
routes.post("/sizes/delete/:id", SizeController.delete);

routes.get("/entrancesandexits", (req, res) => {
  return res.render("entranceandexit/list");
});

module.exports = routes;
