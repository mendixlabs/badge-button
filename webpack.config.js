var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");

module.exports = {
    entry: "./src/com/mendix/widget/badge/Badge.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/com/mendix/widget/badge/Badge.js",
        libraryTarget: "umd",
        umdNamedDefine: true,
        library: "com.mendix.widget.badge.Badge"
    },
    resolve: {
        extensions: [ "", ".ts", ".js", ".json" ]
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.ts$/, loaders: ["ts-loader"] },
            { test: /\.json$/, loader: "json" }
        ],
        postLoaders: [ {
            test: /\.ts$/,
            loader: "istanbul-instrumenter",
            include: path.resolve(__dirname, "src"),
            exclude: /\.(spec)\.ts$/
        } ]
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
