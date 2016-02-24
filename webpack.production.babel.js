import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";

export default {
  entry: "./src",
  output: {
    path: "./dist",
    filename: "pdf-invoice-simple.js",
    libraryTarget: "umd"
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      include: path.resolve(__dirname, "src"),
      loader: "jshint-loader"
    }],
    loaders: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, "src")],
      loader: "babel-loader"
    }]
  },
  externals: (context, request, done) => {
    if (!request.startsWith("./")) return done(null, request);
    done();
  },
  plugins: [
    new CleanWebpackPlugin(["dist"])
  ]
};
