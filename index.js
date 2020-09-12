const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const keys = require("./config/keys");
const User = require("./models/User");
const Coins = require("./models/Coins");
const userRouter = require("./routes/userRoutes");
const coinRouter = require("./routes/coinRoutes");
const simRouter = require("./routes/simRoutes");
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(passport.initialize());
require("./passport")(passport);
app.set("trust proxy", 1);

app.use(function requireHTTPS(req, res, next) {
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
});
app.use("/user", userRouter);
app.use("/coin", coinRouter);
app.use("/sim", simRouter);

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT);
