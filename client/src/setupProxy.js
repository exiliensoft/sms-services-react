const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy(
      [
        "/authorization",
        "/conversation",
        "/message",
        "/did",
        "/group",
        "/user",
        "/plans",
        "/plan",
        "/contact",
        "/field",
      ],
      { target: "http://localhost:3001" }
    )
  );
};
