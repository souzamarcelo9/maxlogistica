require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("./config/session");
const cors = require("cors");
const path = require("path");
const uri = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.static("public"));

  mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas conectado!"))
.catch(err => console.error("Erro ao conectar:", err)); 

app.use(express.static("public"));

/* mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas conectado!"))
.catch(err => console.error("Erro ao conectar:", err)); */

app.use(session);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

nunjucks.configure(path.resolve(__dirname, "views"), {
  watch: true,
  express: app,
  autoescape: true,
});

app.set("view engine", "njk");
app.use(require("./routes"));

app.listen(process.env.PORT || 3002);
