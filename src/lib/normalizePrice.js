module.exports = function normalizePrice(value) {
  if (!value) return 0;

  return Number(
    value
      .replace(/\./g, "")   // remove separador de milhares
      .replace(",", ".")    // converte vírgula em ponto
  );
};