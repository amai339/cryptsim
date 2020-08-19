const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/user","/coin","/sim"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};
