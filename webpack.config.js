const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
};

const commonConfig = merge([
  {
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, "static"),
      publicPath: '/', // Hack to remove the /static
    },
    module: {
      rules: [{
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        }],
      },]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Base",
        favicon: 'src/favicon.png',
        template: 'src/html/base.html',
        filename: '../templates/base.html',
      }),
      new HtmlWebpackPlugin({
        title: "Index",
        template: 'src/html/index.html',
        filename: '../templates/index.html',
        inject: false,
      }),
      new HtmlWebpackPlugin({
        title: "Section",
        template: 'src/html/section.html',
        filename: '../templates/section.html',
        inject: false,
      }),
      new HtmlWebpackPlugin({
        title: "Page",
        template: 'src/html/page.html',
        filename: '../templates/page.html',
        inject: false,
      }),
      new HtmlWebpackPlugin({
        title: "404",
        template: 'src/html/404.html',
        filename: '../templates/404.html',
      }),
    ]
  },
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.extractCSS({
    use: [{
      loader: "css-loader",
      options: {
        importLoaders: 1,
      },
    }, parts.postcss({ minify: true })],
  }),
  parts.generateSourceMaps({ type: "hidden-source-map" }),
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS({ use: [parts.postcss({ styleguide: true })] }),
  parts.generateSourceMaps({ type: "source-map" }),
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};
