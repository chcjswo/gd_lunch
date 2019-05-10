const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "public/js");
const APP_DIR = path.resolve(__dirname, "./src/");

module.exports = {
    mode: "production",
    entry: {
        vendor: ["jquery", "lodash"],
        lunchV1: ["./src/js/notify.min.js", "./src/js/lunchV1.js"],
        lunchV2: ["./src/js/notify.min.js", "./src/js/lunchV2.js"]
    },
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
        path: BUILD_DIR,
        filename: "[name].js",
        publicPath: "/public/"
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
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin("styles.css")
        // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
        // new MiniCssExtractPlugin({ filename: "app.css" })
        // new UglifyJsPlugin()
        new webpack.ProvidePlugin({
            $: "jquery"
        })
    ],
    devtool: "source-map",
    // optimization: {
    //     minimize: true,
    //     splitChunks: {},
    //     concatenateModules: true
    // }
    optimization: {
        minimize: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    name: "vendor",
                    enforce: true
                }
            }
        }
    }
};
