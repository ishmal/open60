/* jshint esversion: 6 */

import Chart from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

import Hammer from "hammerjs";

/**
 * Alternate graph using Chart.js
 */
class SwrGraph {

	constructor(par) {
		this.par = par;
		this.minSwr = 999;
		this.minSwrFreq = par.range.start;
		this.canvas = document.getElementById("chartContainer");
		this.ctx = this.canvas.getContext("2d");
		this.initData();
		this.chart = new Chart(this.ctx, this.data);
		Chart.pluginService.register(annotationPlugin);
		this.setupEvents();
	}

	initData() {

		this.data = {
			plugins: [
				annotationPlugin
			],
			type: "line",
			data: {
				datasets: [{
					label: "vswr",
					data: [],
					xAxisID: "X",
					yAxisID: "A",
					fill: false,
					borderWidth: 6,
					borderColor: "rgba(75,255,0,0.6)",
					backgroundColor: "rgba(75,255,0,0.6)"
			}, {
					label: "impedance",
					data: [],
					xAxisID: "X",
					yAxisID: "B",
					fill: false,
					borderWidth: 6,
					borderColor: "rgba(255,75,0,0.6)",
					backgroundColor: "rgba(255,75,0,0.6)"
				}]
			},
			options: {
				animation: false,
				title: {
					display: true,
					text: this.par.range.name,
					fontSize: 14,
					fontStyle: "bold",
					fontColor: "yellow"
				},
				scales: {
					yAxes: [{
						id: "A",
						type: "logarithmic",
						position: "left",
						ticks: {
							min: 1,
							max: 10,
							fontStyle: "bold",
							fontColor: "yellow",
							callback: function (value, index, values) {
								return Math.floor(value).toString();
							}
						}
					}, {
						id: "B",
						type: "logarithmic",
						position: "right",
						ticks: {
							min: 1,
							max: 10000,
							fontStyle: "bold",
							fontColor: "yellow",
							callback: function (value, index, values) {
								let s = Math.floor(value).toString();
								if (s.startsWith("1") || s.startsWith("5")) {
									return s;
								}
							}
						}
					}],
					xAxes: [{
						id: "X",
						type: "linear",
						position: "bottom",
						ticks: {
							fontStyle: "bold",
							fontColor: "yellow",
							min: 13600,
							max: 14700
						}
					}]
				},
				annotation: {
					drawTime: "afterDraw",
					annotations: []
				}
			}
		};

	}

	adjustData() {
		let range = this.par.range;
		let opts = this.data.options;
		let ticks = opts.scales.xAxes[0].ticks;
		ticks.min = range.start;
		ticks.max = range.end;
		opts.title.text = range.name;
	}

	startScan() {
		let range = this.par.range;
		//this 'ticks' code duplicated below intentionally
		this.adjustData();
		let ds = this.chart.data.datasets;
		ds[0].data = [];
		ds[1].data = [];
		this.data.options.annotation.annotations = [];
		this.minSwr = 999;
		this.minSwrFreq = range.start;
		this.minR = Number.MAX_VALUE;
		this.minRFreq = range.start;
		this.redraw();
	}

	endScan() {
		let txt = this.minSwrFreq.toFixed(0) + "   :   " + this.minSwr.toFixed(1);
		let annot = {
			type: "line",
			mode: "vertical",
			scaleID: "X",
			value: this.minSwrFreq,
			borderColor: "red",
			borderWidth: 3,
			label: {
				enabled: true,
				fontSize: 14,
				content: txt
			}
		};
		let annots = this.data.options.annotation.annotations;
		annots.push(annot);
		this.redraw();
	}

	update(datapoint) {
		let range = this.par.range;
		let nrSteps = this.par.nrSteps;
		let ds = this.chart.data.datasets;
		let len = ds[0].data.length;
		let freq = range.start + (range.end - range.start) * len / nrSteps;
		let swr = datapoint.swr;
		if (swr < this.minSwr) {
			this.minSwr = swr;
			this.minSwrFreq = freq;
		}
		ds[0].data.push({
			x: freq,
			y: swr
		});
		ds[1].data.push({
			x: freq,
			y: datapoint.r
		});
		this.redraw();
	}

	redraw() {
		window.requestAnimationFrame(() => {
			try {
				this.chart.update(0);
			} catch(e) {
				console.log("redraw: " + e);
			}
		});
	}

	setupEvents() {
		let that = this;
		let par = this.par;
		let hammer = new Hammer(this.canvas);
		hammer.on("doubletap", (evt) => {
			par.checkConnectAndScan();
		});
		hammer.on("swipeleft", (evt) => {
			par.next();
			that.adjustData();
			that.redraw();
		});
		hammer.on("swiperight", (evt) => {
			par.prev();
			that.adjustData();
			that.redraw();
		});
	}



}

export default SwrGraph;
