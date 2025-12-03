const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PricingItemSchema = new Schema({
  type: {
    type: String,
    enum: ["INGREDIENTE", "INSUMO", "MAO_DE_OBRA"],
    required: true,
  },
  name: { type: String, required: true },      // Ex: Açaí, Granola, Copo, Colaborador
  unit: { type: String },                      // Ex: g, ml, unidade, hora
  packageQty: { type: Number, default: 0 },    // QTDE total do pacote/compras
  packageCost: { type: Number, default: 0 },   // Valor pago no pacote
  usedQty: { type: Number, default: 0 },       // Qtd usada por unidade do produto
  usedCost: { type: Number, default: 0 },      // Custo proporcional usado
});

const PricingSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product", 
    required: false,
  },
  productName: {
    type: String,   // snapshot do nome do produto
    required: true,
  },
  margin: {
    type: Number,   // ex: 70 = 70%
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  suggestedPrice: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  items: [PricingItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pricing", PricingSchema);