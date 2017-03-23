var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/components/BadgeButtonContainer.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/com/mendix/widget/custom/badgebutton/BadgeButton.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }) }
        ]
    },
    devtool: "source-map",
    externals: ["dojo/_base/declare", "mxui/widget/_WidgetBase"],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" }
        ], {
                copyUnmodified: true
            }),
        new ExtractTextPlugin({ filename: "./src/com/mendix/widget/custom/badgebutton/ui/BadgeButton.css" }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
