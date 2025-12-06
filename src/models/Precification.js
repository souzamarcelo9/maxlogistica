// models/Precification.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrecificationItemSchema = new Schema({
  ingredientName: String,
  type: String,
  unit: String,
  packageQty: Number,
  packageCost: Number,
  usedQty: Number,
  usedCost: Number,
});

const PrecificationSchema = new Schema({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: false,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  productName: {
    type: String,
    required: true,
  },
  size: {
    type: String, // "300 ml", "500 ml", etc.
    required: true,
  },
  margin: {
    type: Number,
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
  notes: String,
  itemsSnapshot: [PrecificationItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Precification", PrecificationSchema);
