const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "dist/js");
const APP_DIR = path.resolve(__dirname, "./public/");

module.exports = {
    mode: "production",
    entry: {
        js_lib: ["jquery", "bootstrap", "underscore"],
        lunchV1: ["@babel/polyfill", "./public/js/lunchV1.js"],
        lunchV2: ["@babel/polyfill", "./public/js/lunchV2.js"]
    },
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
        path: BUILD_DIR,
        filename: "[name].js",
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [`${APP_DIR}`],
                exclude: ["/node_modules"],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: { node: "current" },
                                    modules: "false"
                                }
                            ]
                        ]
                    }
                }
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         "css-loader",
            //         "sass-loader?outputStyle=expanded"
            //         // 'sass-loader?outputStyle=compressed'
            //     ],
            //     exclude: /node_modules/
            // }
            {
                test: /\.css$/,
                include: [`${APP_DIR}`],
                use: ["style-loader", "css-loader"]
                // use: [MiniCssExtractPlugin.loader, "css-loader"]
                // exclude: ["/node_modules"]
            }
        ]
    },
    plugins: [
        // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
        new MiniCssExtractPlugin({ filename: "dist/css/style.css" })
        // new MiniCssExtractPlugin({ filename: "app.css" })
        // new UglifyJsPlugin()
    ],
    devtool: "source-map",
    optimization: {
        minimize: true,
        splitChunks: {},
        concatenateModules: true
    }
};
