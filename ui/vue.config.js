module.exports = {
  configureWebpack: {
    devtool: "source-map",
    module: {
      rules: [{
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
        {
          test: /\.gql?$/,
          loader: "webpack-graphql-loader"
        }
      ]
    },
    resolve: {
      extensions: [".webpack.js", ".web.js", ".mjs", ".js", ".json"]
    }
  }
};