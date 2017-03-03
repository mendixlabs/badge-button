var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");

module.exports = {
    entry: "./src/com/mendix/widget/custom/badgebutton/BadgeButton.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/com/mendix/widget/custom/badgebutton/BadgeButton.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ "", ".ts", ".js", ".json" ],
        alias:{
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.ts$/, loaders: [ "ts-loader" ] },
            { test: /\.json$/, loader: "json" }
        ]
    },
    devtool: "source-map",
    externals: [ "mxui/widget/_WidgetBase", "dojo/_base/declare" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" }
        ], {
            copyUnmodified: true
        })
    ],
    watch: true
};
