const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  // baseUrl: "/",
  publicPath: "./",
  devServer: {
    proxy: {
      "/microModule": {
        target: "http://192.168.1.141:8090/microModule",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/microModule": "/"
        }
      }
    }
  },
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
