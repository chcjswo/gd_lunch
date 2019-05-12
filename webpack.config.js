const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(__dirname, "./public");
const APP_DIR = path.resolve(__dirname, "./src/");

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        vendor: ["jquery", "lodash"],
        lunchV1: [
            "./src/js/notify.min.js",
            "./src/js/lunchV1.js",
            "./src/css/offcanvas.css",
            "./src/css/loading.css"
        ],
        lunchV2: [
            "./src/js/notify.min.js",
            "./src/js/lunchV2.js",
            "./src/css/offcanvas.css",
            "./src/css/loading.css"
        ]
    },
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
        path: `${BUILD_DIR}/js`,
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // include: [`${APP_DIR}`],
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
                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: "css-loader"
                // })
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(gif|jpg|png|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "../img/[name].[ext]"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin("styles.css"),
        // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
        // new MiniCssExtractPlugin({ filename: "app.css" })
        // new UglifyJsPlugin()
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "../css/[name].css"
        })
    ],
    // devtool: "source-map",
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
