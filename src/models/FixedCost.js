const mongoose = require("mongoose");

const FixedCostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ex: Luz, Aluguel, Água, Internet, etc
  },
  monthlyValue: {
    type: Number,
    required: true, // Valor mensal em R$
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FixedCost", FixedCostSchema);
