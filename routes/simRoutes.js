const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.patch("/money", async (req, res) => {
  const { amount, id } = req.body;
  const currentAmount = await User.findById(id, {});
  const newAmount = currentAmount.money + amount;
  const moneyInvested = currentAmount.money + amount;
  const time = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  let time_arr = time.split(" ");
  time_arr[0] = time_arr[0].slice(0, time_arr[0].length - 1);
  if (time_arr[1].startsWith("1")) {
    time_arr[1] = time_arr[1].slice(0, 5);
  } else {
    time_arr[1] = time_arr[1].slice(0, 4);
  }
  time_arr = time_arr.join(" ");
  const newActivity = {
    transaction_type: "Add Money",
    coin: null,
    volume: amount,
    price: null,
    time: time_arr,
  };
  await User.updateOne(
    { _id: id },
    {
      $set: { money: newAmount, moneyInvested },
      $push: { history: newActivity },
    }
  );
  res.send(newAmount.toString());
});
router.get("/money", async (req, res) => {
  try {
  const user = await User.findById(req.query.id, {}).catch((e) =>
    console.log(e)
  );
  res.send(user.money.toString());
  }
  catch {
    
  }
});
router.patch("/buy", async (req, res) => {
  const { id, volume, price, coin } = req.body;
  let decimal = 0;
  let fixedVolume = volume.split(".");
  if (fixedVolume.length > 1) {
    decimal = fixedVolume[1].length;
  }

  fixedVolume = fixedVolume.join(".");
  const user = await User.findById(id, {});
  let { money, sim_wallet, netProfit } = user;
  netProfit = (netProfit - Number(price)).toFixed(2);
  money = (money - Number(price)).toFixed(2);
  let found = false;
  sim_wallet.forEach((e) => {
    if (e.coin === coin) {
      const split = e.volume.toString().split(".");
      if (split.length > 1) {
        if (decimal < split[1].length) decimal = split[1].length;
      }
      if (decimal > 8) decimal = 8;
      e.volume = (e.volume + Number(fixedVolume)).toFixed(decimal);
      found = true;
    }
  });
  if (!found) {
    sim_wallet.push({ coin, volume });
  }
  const time = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  let time_arr = time.split(" ");
  time_arr[0] = time_arr[0].slice(0, time_arr[0].length - 1);
  if (time_arr[1].startsWith("1")) {
    time_arr[1] = time_arr[1].slice(0, 5);
  } else {
    time_arr[1] = time_arr[1].slice(0, 4);
  }
  time_arr = time_arr.join(" ");
  const newActivity = {
    transaction_type: "Buy",
    coin,
    volume,
    price,
    time: time_arr,
  };
  await User.updateOne(
    { _id: id },
    {
      $set: { money, sim_wallet, netProfit },
      $push: { history: newActivity },
    }
  );
  res.send(money);
});
router.patch("/sell", async (req, res) => {
  const { id, volume, price, coin } = req.body;
  const user = await User.findById(id, {});
  let { money, sim_wallet, netProfit } = user;
  netProfit = (netProfit + Number(price)).toFixed(2);
  money = (money + Number(price)).toFixed(2);
  sim_wallet.forEach((e) => {
    if (e.coin === coin) {
      e.volume = (e.volume - Number(volume)).toFixed(8);
    }
  });
  const time = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  let time_arr = time.split(" ");
  time_arr[0] = time_arr[0].slice(0, time_arr[0].length - 1);
  if (time_arr[1].startsWith("1")) {
    time_arr[1] = time_arr[1].slice(0, 5);
  } else {
    time_arr[1] = time_arr[1].slice(0, 4);
  }
  time_arr = time_arr.join(" ");
  const newActivity = {
    transaction_type: "Sell",
    coin,
    volume,
    price,
    time: time_arr,
  };
  await User.updateOne(
    { _id: id },
    {
      $set: { money: money, sim_wallet, netProfit },
      $push: { history: newActivity },
    }
  );
  res.send(money);
});
router.get("/wallet", async (req, res) => {
  const user = await User.findById(req.query.id, {});
  res.send(user.sim_wallet);
});
router.get("/history", async (req, res) => {
  const user = await User.findById(req.query.id, {});
  res.send(user.history.reverse());
});
router.get("/totalinvested", async (req, res) => {
  const user = await User.findById(req.query.id, {});
  const profit_invested = {
    profit: user.netProfit,
    invested: user.moneyInvested,
  };
  res.send(profit_invested);
});
module.exports = router;
