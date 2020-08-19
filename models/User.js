const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  sim_wallet: [
    {
      coin: String,
      volume: Number,
    },
  ],
  history: [
    {
      transaction_type: String,
      coin: String,
      volume: Number,
      price: Number,
      time: String,
    },
  ],
  money: { type: Number, default: 0 },
  watchlist: [String],
  netProfit: {type:Number, default: 0},
  moneyInvested: {type:Number, default :0}
});
UserSchema.pre("save", function (next) {
  const def= ['BTC', 'ETH', 'XRP', 'BCH', 'LTC', 'LINK']
  if (!this.isModified("password")) {
    return next;
  }
  this.watchlist = def;
  bcrypt.hash(this.password, 10, (err, hashed) => {
    if (err) return next(err);
    this.password = hashed;
    next();
  });
});

module.exports = mongoose.model("users", UserSchema);
