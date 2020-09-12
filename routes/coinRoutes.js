const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const CoinMarketCap = require("coinmarketcap-api");
const Coin = require("../models/Coins");
const rateLimit = require("express-rate-limit");

const client = new CoinMarketCap(keys.coinMarketKey);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000 * 5, // 5 minute
  max: 1,
  statusCode: 200,
});
router.patch("/latest", apiLimiter, async (req, res) => {
  const opts = {
    points: 6,
    duration: 60,
  };
  client
    .getTickers({ convert: "USD" })
    .then(async (data) => {
      const coinsArray = data.data.map((x) => ({
        name: x["name"],
        price: x["quote"]["USD"]["price"],
        symbol: x["symbol"],
        id: x["id"],
        dailyChange: x["quote"]["USD"]["percent_change_24h"],
      }));
      await Coin.deleteMany({});
      await Coin.insertMany(coinsArray);
    })
    .catch(console.error);
  res.send();
});

router.get("/all", async (req, res) => {
  const response = await Coin.find({});
  res.send(response);
});
router.post("/list", async (req, res) => {
  let coin_map = new Map();
  for (let i = 0; i < req.body.length; i++) {
    const response = await Coin.findOne({ symbol: req.body[i].toUpperCase() });
    coin_map[response.symbol] = response;
  }
  res.send(coin_map);
});
router.get("/:symbol", (req, res) => {
  Coin.findOne({ symbol: req.params.symbol.toUpperCase() }, (err, found) => {
    res.send(found);
  });
});

module.exports = router;
