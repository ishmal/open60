const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const promisify = require("util").promisify;
const del = require("del");
const mkdirp = require("mkdirp");
const webpack = require("webpack");

const p_copyFile = promisify(fs.copyFile);
const p_mkdirp = promisify(mkdirp);

const MODULES =  path.join(__dirname, "node_modules");
const SRC = path.join(__dirname, "src");
const SRCCSS = path.join(SRC, "css");
const SRCJS = path.join(SRC, "js");
const SRCIMG = path.join(SRC, "img");
const WWW = path.join(__dirname, "www");
const WWWJS = path.join(WWW, "js");
const WWWCSS = path.join(WWW, "css");
const WWWIMG = path.join(WWW, "img");
const BS = path.join(MODULES, "bootstrap", "dist");
const BSCSS = path.join(BS, "css");
const BSJS = path.join(BS, "js");
const JQUERY = path.join(MODULES, "jquery", "dist");

function copy(fname, srcDir, destDir) {
	let src = path.join(srcDir, fname);
	let dest = path.join(destDir, fname);
	return p_copyFile(src, dest);
}

gulp.task("clear", () => {
	return del([WWW]);
});

gulp.task("copyfiles", async () => {
	await p_mkdirp(WWWCSS);
	await p_mkdirp(WWWJS);
	await p_mkdirp(WWWIMG);
	await copy("index.html", SRC, WWW);
	await copy("index.js", SRCJS, WWWJS);
	await copy("index.css", SRCCSS, WWWCSS);
	await copy("mini60.jpg", SRCIMG, WWWIMG);
	await copy("icon.png", SRCIMG, WWWIMG);
	await copy("bootstrap.min.css", BSCSS, WWWCSS);
	await copy("bootstrap.min.css.map", BSCSS, WWWCSS);
	await copy("bootstrap.min.js", BSJS, WWWJS);
	await copy("bootstrap.min.js.map", BSJS, WWWJS);
	await copy("jquery.min.js", JQUERY, WWWJS);
	return copy("jquery.min.map", JQUERY, WWWJS);
});

const webpackConfig = require("./webpack.config.js");

gulp.task("webpack-build", (done) => {
	let myConfig = Object.assign({}, webpackConfig);

	webpack(myConfig, (err, stats) => {
		if (err) {
			console.log(err);
			process.exit(-1);
		} else {
			console.log(stats.toString({}));
		}
		//console.log(stats);
		done();
	});
})

gulp.task("build", gulp.series("clear", "copyfiles", "webpack-build"));

gulp.task("default", gulp.series("build"));
