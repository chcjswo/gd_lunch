const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: [
        "@babel/polyfill",
        "./public/js/lunchV1.js",
        "./pubc/cscc/loading.css",
        "./pubc/cscc/offcanvas.css"
    ],
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "bundle.js"
    },
    plugins: [
        // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
        new MiniCssExtractPlugin({ filename: "dist/css/style.css" })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, "public/js")],
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader?outputStyle=expanded"
                    // 'sass-loader?outputStyle=compressed'
                ],
                exclude: /node_modules/
            }
        ]
    },
    devtool: "source-map",
    // https://webpack.js.org/concepts/mode/#mode-development
    mode: "development"
};
