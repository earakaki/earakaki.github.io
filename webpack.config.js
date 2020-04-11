const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const path = require("path");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
};

const commonConfig = merge([
  {
    output: {
      filename: '[name].[hash].bundle.js',
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
        cspPlugin: {
          enabled: true,
          policy: {
            'default-src': "'self'",
            'connect-src': "'self' ws:",
            'script-src': "'self'",
            'style-src': "'self' 'unsafe-inline'",
            'object-src': "'none'",
          },
          nonceEnabled: {
            'script-src': true,
            'style-src': false,
    },
        },
      }),
      new HtmlWebpackPlugin({
        title: "Index",
        template: 'src/html/index.html',
        filename: '../templates/index.html',
        inject: false,
        cspPlugin: {
          enabled: false,
        },
      }),
      new HtmlWebpackPlugin({
        title: "Section",
        template: 'src/html/section.html',
        filename: '../templates/section.html',
        inject: false,
        cspPlugin: {
          enabled: false,
        },
      }),
      new HtmlWebpackPlugin({
        title: "Page",
        template: 'src/html/page.html',
        filename: '../templates/page.html',
        inject: false,
        cspPlugin: {
          enabled: false,
        },
      }),
      new HtmlWebpackPlugin({
        title: "404",
        template: 'src/html/404.html',
        filename: '../templates/404.html',
      }),
      new CspHtmlWebpackPlugin()
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
  parts.loadCSS({ use: [parts.postcss()] }),
  parts.generateSourceMaps({ type: "source-map" }),
]);

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return merge(commonConfig, productionConfig, { mode: argv.mode });
  }
  return merge(commonConfig, developmentConfig, { mode: argv.mode });
};
