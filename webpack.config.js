const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: './src/index.js',
        visual: './src/visual.js',
      },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/main.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // ...additional rules...
        ],
    },

    module: {
        rules: [
            // ...additional rules...
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
    ],
};