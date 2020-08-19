const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const CoinMarketCap = require("coinmarketcap-api");
const Coin = require("../models/Coins");
const client = new CoinMarketCap(keys.coinMarketKey);

router.patch("/latest", async (req, res) => {
  const data = await client.getTickers({ convert: "USD" });
  const coinsArray = data.data.map(x => ({
    name: x["name"],
    price: x["quote"]["USD"]["price"],
    symbol: x["symbol"],
    id: x['id'],
    dailyChange: x["quote"]["USD"]["percent_change_24h"],
  }));
  for (var i = 0; i < coinsArray.length; i++) {
    const name = coinsArray[i]["name"];
    const price = coinsArray[i]["price"];
    const symbol = coinsArray[i]["symbol"];
    const id = coinsArray[i]["id"];
    const dailyChange = coinsArray[i]["dailyChange"];
    const newData = { name, price, symbol, id, dailyChange };
    const query = { id: id };
    Coin.findOneAndUpdate(query, newData, { upsert: true }, (err) => {
      if (err) console.log(err);
    });
  }
  res.send(coinsArray);
});

router.get('/all' , async (req,res)=> {
  const response = await Coin.find({})
  res.send(response);
})
router.post("/list", async (req, res) => {
  let coin_map= new Map();  
  for (let i = 0; i < req.body.length; i++) {
    const response = await Coin.findOne({ symbol: req.body[i].toUpperCase()})
    coin_map[response.symbol] =response;
  }
  res.send(coin_map);
});
router.get("/:symbol", (req, res) => {
  Coin.findOne({ symbol: req.params.symbol.toUpperCase() }, (err, found) => {
    res.send(found);
  });
});

module.exports = router;
