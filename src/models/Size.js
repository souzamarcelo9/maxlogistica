const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SizeSchema = new Schema({
  label: {
    type: String,
    required: true,
    unique: true, // Evita duplicação
  },
  unit: {
    type: String,
    required: true, // ex: ml, g, un
  },
  quantity: {
    type: Number,
    required: true, // ex: 500 (para 500 ml)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Size", SizeSchema);
