//#############################################################
//## I M P O R T S
//#############################################################

const webpack = require("webpack");
const presetEnv = require("@babel/preset-env");
const path = require("path");


//#############################################################
//## C O N F I G
//#############################################################

const BABEL_OPTS = {
	"presets": [
		[presetEnv]
	]
};

const config = {
	mode: "development",
	entry: {
		index: "./src/js/index.js"
	},
	output: {
        filename: "[name].js",
        path: __dirname + "/www/js"
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".json"]
	},
	module: {
		rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: BABEL_OPTS
        }]
	},
	devtool: "inline-source-map",
};

module.exports = config;
