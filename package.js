Package.describe({
  summary: "Admin view and editor for automated system mailings",
  version: "1.0.0",
  name: "lef:systemmailing",
  git: "https://github.com/LEFapps/lef-systemmailing"
});

Package.onUse(api => {
  api.use([
    "ecmascript",
    "mongo",
    "lef:adminlist",
    "alanning:roles",
    "lef:alerts"
  ]);
  api.mainModule("client.js", "client");
  api.mainModule("server.js", "server");
});

Npm.depends({
  react: "16.4.2",
  reactstrap: "5.0.0",
  "prop-types": "15.6.2",
  "markdown-it": "8.4.2",
  lodash: "4.17.10"
});
