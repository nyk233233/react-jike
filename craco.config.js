const { whenProd, getPlugin, pluginByName } = require("@craco/craco");
const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    // 配置CDN
    configure: (webpackConfig) => {
      let cdn = {
        js: [],
      };
      // 暂时禁用CDN配置，让React和ReactDOM打包到应用中
      // whenProd(() => {
      //   webpackConfig.externals = {
      //     react: "React",
      //     "react-dom": "ReactDOM",
      //   };
      //   cdn = {
      //     js: [
      //       "https://unpkg.com/react@19.1.0/umd/react.production.min.js",
      //       "https://unpkg.com/react-dom@19.1.0/umd/react-dom.production.min.js",
      //     ],
      //   };
      // });

      // 通过 htmlWebpackPlugin插件 在public/index.html注入cdn资源url
      const { isFound, match } = getPlugin(
        webpackConfig,
        pluginByName("HtmlWebpackPlugin")
      );

      if (isFound) {
        // 找到了HtmlWebpackPlugin的插件
        match.options.files = cdn;
      }

      return webpackConfig;
    },
  },
};
