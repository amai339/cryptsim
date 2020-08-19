const mongoose = require("mongoose");

const CoinSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  id: Number,
  dailyChange: Number,
});

module.exports = mongoose.model("Coin", CoinSchema);
