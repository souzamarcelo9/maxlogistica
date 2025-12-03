const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = new mongoose.Schema({
  barcode: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  salePrice: {
    type: Number,
    required: true,
  },

  expirationDate: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
  type: String,
  enum: ["FINAL", "OUTRO"],
  default: "FINAL",
}
});

ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Product", ProductSchema);
