import config from "./webpack.production.babel";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

config.entry = "./demo";
config.module.loaders[0].include.push(path.resolve(__dirname, "demo"));
config.output.publicPath = "/";
config.debug = true;
config.devtool = "source-map";
config.module.preLoaders.shift();
config.devServer = {
  inline: true,
  port: 3000,
  contentBase: "./dist"
};
config.plugins.shift();
config.plugins.unshift(new HtmlWebpackPlugin({
  template: "./demo/index.html",
  inject: true
}));
delete config.externals;

export default config;
