const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin()],
});

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new TerserPlugin({ sourceMap: true })],
  },
});

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    //stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
  },
});

exports.extractCSS = ({ include, exclude, use = [] }) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [
            MiniCssExtractPlugin.loader,
          ].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.loadCSS = ({ include, exclude, use = [] }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ["style-loader", {
          loader: "css-loader",
          options: {
            importLoaders: 1,
          },
        }].concat(use),
      },
    ],
  },
});

exports.postcss = ({ minify = false, styleguide = false } = {}) => ({
  loader: "postcss-loader",
  options: {
    sourceMap: true,
    plugins: (loader) => {
      var list = [
        require('postcss-import')(), // Needed for custom-media queries
        require("postcss-normalize")(),
        require("postcss-preset-env")({ stage: 1 }),
      ];
      list = minify ? list.concat(require("@fullhuman/postcss-purgecss")({ content: ['./src/**/*.html']})) : list;
      list = minify ? list.concat(require('cssnano')({ preset: "default" })) : list;
      list = styleguide ? list.concat(require('postcss-style-guide')()) : list;
      return list;
    },
  },
});

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});
