import Chart from "chart.js";

/**
 * Alternate graph using Chart.js
 */
class SwrGraph {

	constructor(par) {
		this.par = par;
		this.minSwr = 999;
		this.minSwrFreq = par.range.start;
		this.canvas = document.getElementById('chartContainer');
		this.ctx = this.canvas.getContext('2d');
		this.annots = [];
		this.initData();
		this.chart = new Chart(this.ctx, this.data);
		this.setupEvents();
	}

	initData() {

		this.data = {
			plugins: [
				"chartjs-plugin-annotation"
			],
			type: 'line',
			data: {
				datasets: [{
					label: 'vswr',
					data: [],
					xAxisID: 'X',
					yAxisID: 'A',
					fill: false,
					borderWidth: 6,
					borderColor: "rgba(75,255,0,0.6)",
					backgroundColor: "rgba(75,255,0,0.6)"
				}, {
					label: 'impedance',
					data: [],
					xAxisID: 'X',
					yAxisID: 'B',
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
					text: this.par.range.name
				},
				scales: {
					yAxes: [{
						id: 'A',
						type: 'logarithmic',
						position: 'left',
						ticks: {
							min: 1,
							max: 10,
							callback: function (value, index, values) {
								return Math.floor(value).toString();
							}
						}
					}, {
						id: 'B',
						type: 'logarithmic',
						position: 'right',
						ticks: {
							min: 1,
							max: 10000,
							callback: function (value, index, values) {
								let s = Math.floor(value).toString();
								if (s.startsWith('1') || s.startsWith('5')) {
									return s;
								}
							}
						}
					}],
					xAxes: [{
						id: 'X',
						type: "linear",
						position: "bottom",
						ticks: {
							min: 13600,
							max: 14700
						}
					}]
				},
				annotation: {
					drawTime: "afterDraw",
					annotations: this.annots
				}
			}
		};

	}

	startScan() {
		let ds = this.chart.data.datasets;
		ds[0].data = [];
		ds[1].data = [];
		this.annots.length = 0;
		this.minSwr = 999;
		this.minSwrFreq = this.par.range.start;
		this.minR = Number.MAX_VALUE;
		this.minRFreq = par.range.start;
		this.redraw();
	}

	endScan() {
		let txt = this.minSwrFreq.toFixed(1) + '  :  ' + this.minSwr.toFixed(1);
		let annot = {
			type: 'line',
			mode: 'vertical',
			scaleID: 'X',
			value: this.minSwrFreq,
			borderColor: 'red',
			borderWidth: 2,
			label: {
				enabled: true,
				content: txt
			}
		};
		this.annots.push(annot);
		this.redraw();
	}

	update(datapoint) {
		let par = this.par;
		let ds = this.chart.data.datasets;
		let len = ds[0].data.length;
		let freq = par.range.start + len * (par.range.step);
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
		window.requestAnimationFrame(() => this.chart.update(0));
	}

	setupEvents() {
		let par = this.par;
		let clicked = false;
		this.canvas.addEventListener('click', (evt) => {
			if (!clicked) {
				clicked = true;
				setTimeout(() => {
					if (clicked) {
						//single
						let w = this.canvas.clientWidth;
						let x = evt.clientX;
						if (x < w / 2) {
							par.prev();
						} else {
							par.next();
						}
						data.options.title.text = par.range.name;
						let ticks = data.options.scales.xAxes[0].ticks;
						ticks.min = par.range.start;
						ticks.max = par.range.end;
						this.redraw();
					}
					clicked = false;
				}, 300);
			} else {
				//double
				clicked = false;
				this.par.checkConnectAndScan();
			}
		});

	}

}

export default SwrGraph;
