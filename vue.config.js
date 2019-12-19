const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
// const debug = process.env.NODE_ENV !== "production";
let cesiumSource = "./node_modules/cesium/Source";
let cesiumWorkers = "../Build/Cesium/Workers";
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  // baseUrl: "/",
  publicPath: "./",
  devServer: {
    port: 8888,
    proxy: {
      "/AccessRoom": {
        target: "http://192.168.1.73:8033/AccessRoom", // 向航
        // target: "http://192.168.1.178:8022/infoCollectTool",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/AccessRoom": "/"
        }
      }
    }
  },
  configureWebpack: {
    output: {
      sourcePrefix: " " // 1
    },
    amd: {
      // 2
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@": path.resolve("src"),
        cesium: path.resolve(__dirname, cesiumSource) // 3
      }
    },
    plugins: [
      // 4
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" }
      ]),
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, "assets"), to: "Assets" }
      ]),
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, "Widgets"), to: "Widgets" }
      ]),
      new CopyWebpackPlugin([
        {
          from: path.join(cesiumSource, "ThirdParty/Workers"),
          to: "ThirdParty/Workers"
        }
      ]),
      new webpack.DefinePlugin({
        // 5
        CESIUM_BASE_URL: JSON.stringify("./")
      })
    ],
    module: {
      // unknownContextCritical: /^.\/.*$/
      unknownContextCritical: false // 6
    }
  },
  //blog.csdn.net/weixin_44402694/article/details/88028155
  //允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    //命名
    config.resolve.alias.set("@", resolve("src"));
    //打包文件带hash
    config.output.filename("[name].[hash].js").end();

    //为了补删除换行而加的配置
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // modify the options...
        options.compilerOptions.preserveWhitespace = true;
        return options;
      });
  }
};
