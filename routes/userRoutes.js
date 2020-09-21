const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Coin = require("../models/Coins");
const keys = require("../config/keys");
const bcrypt = require("bcrypt");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      });
      newUser.save().then((user) => res.send(user));
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email.toLowerCase();
  const inputPW = req.body.password;
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    const { id, name, password } = user;
    bcrypt.compare(inputPW, password, (err, match) => {
      if (match) {
        const payload = { id, name };
        jwt.sign(
          payload,
          keys.authenticationKey,
          { expiresIn: 31556926 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/watchlist", async (req, res) => {
  let response = await User.findById(req.query.id);
  let watchlist = response.watchlist;
  let watching = [];
  for (const i in watchlist) {
    const res = await Coin.findOne({ symbol: watchlist[i] });
    watching.push(res);
  }
  res.send(watching);
});
router.patch("/watchlist", async (req, res) => {
  const { symbols, id } = req.body;
  await User.updateOne({ _id: id }, { $set: { watchlist: symbols } });
  res.send(symbols);
});

module.exports = router;
