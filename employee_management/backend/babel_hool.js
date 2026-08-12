const babelRegister = require("@babel/register");

(babelRegister.default || babelRegister)({
  presets: [["@babel/preset-env"]],
  plugins: ["@babel/plugin-transform-runtime"],
});
require("./server");
