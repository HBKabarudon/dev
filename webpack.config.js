const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cssInline = false;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const WebpackWatchedGlobEntries = require("webpack-watched-glob-entries-plugin");
const { htmlWebpackPluginTemplateCustomizer } = require("template-ejs-loader");
const entries = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, "./src/*.ejs")], {
  ignore: path.resolve(__dirname, "./src/_*.ejs"),
})();
const globule = require("globule");
// pugファイルの複数ページ対応
const pugPaths = globule.find({
  src: ["src/**/*.pug", "!src/**/_*.pug"],
});

if (cssInline) {
  styleLoader = "style-loader";
} else {
  styleLoader = { loader: MiniCssExtractPlugin.loader };
}

// 複数htmlを出力させる
const htmlGlobPlugins = (entries, srcPath) => {
  return Object.keys(entries).map(
    (key) =>
      new HtmlWebpackPlugin({
        //出力ファイル名
        filename: `${key}.html`,
        //テンプレートに使用するファイルを指定 htmlの場合は.html ejsの場合は.ejs
        template: htmlWebpackPluginTemplateCustomizer({
          templatePath: `${srcPath}/${key}.ejs`,
        }),
        // <script> ~ </script> タグの挿入位置
        inject: "body",
        // スクリプト読み込みのタイプ
        scriptLoading: "defer",
      })
  );
};

module.exports = {
  mode: "development",

  devServer: {
    static: path.resolve(__dirname, "src"),
    port: 8080,
    open: true,
    hot: true,
  },

  devtool: "source-map",
  entry: "./src/assets/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/index.js",
    assetModuleFilename: "assets/images/[name][ext]",
  },
  module: {
    rules: [
      {
        // 処理対象のファイルの指定
        test: /\.pug$/,
        // 変換で使用するローダーを指定
        use: {
          loader: "pug-loader",
          options: {
            pretty: true,
            root: path.resolve(__dirname, "src"),
          },
        },
      },
      {
        test: /\.ejs$/i,
        use: ["template-ejs-loader"],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        // node_module内のcss
        test: /node_modules\/(.+)\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: { url: false },
          },
        ],
        sideEffects: true, // production modeでもswiper-bundle.cssが使えるように
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer", { grid: true }],
                  ["cssnano", { preset: "default" }],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "assets/css/style.css" }),
    ...htmlGlobPlugins(entries, "./src"),
    new CopyPlugin({
      patterns: [
        {
          from: `${path.resolve(__dirname, "src")}/assets/images/`,
          to: `${path.resolve(__dirname, "dist")}/assets/images/`,
        },
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(png|jpe?g)$/i, // 対象ファイル
          options: {
            quality: 75, // 画質
          },
        },
      ],
    }),
  ],
};

pugPaths.forEach(function (pugPath) {
  const filename = pugPath.replace("src/", "").replace(".pug", ".html");
  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      template: pugPath,
      filename,
      minify: false,
      // <script> ~ </script> タグの挿入位置
      inject: "body",
      // スクリプト読み込みのタイプ
      scriptLoading: "defer",
    })
  );
});
