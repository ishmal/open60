/**
 * ALternate graph using Chart.js
 */
org.open60.SwrGraph = function(par) {

	var that = this;
	var minswr = 999;

	var data = {
		type: 'myLine',
		data: {
			datasets: [{
				label: 'vswr',
				data: [],
				fill: true,
				xAxisID: 'X',
				yAxisID: 'A',
				backgroundColor: "rgba(153,255,51,0.6)"
			}, {
				label: 'impedance',
				data: [],
				fill: true,
				xAxisID: 'X',
				yAxisID: 'B',
				backgroundColor: "rgba(255,153,0,0.6)"
			}]
		},
		options: {
			lineAtIndex: 0,
			animation: false,
			title: {
				display: true,
				text: par.range.name
			},
			scales: {
				yAxes: [{
					id: 'A',
					type: 'logarithmic',
					position: 'left',
					ticks: {
						min: 1,
						max: 10,
						callback: function(value, index, values) {
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
						callback: function(value, index, values) {
							var s = Math.floor(value).toString();
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
			}
		}
	};

	Chart.controllers.myLine = Chart.controllers.line.extend({
		draw: function() {
			Chart.types.Line.prototype.draw.apply(this, arguments);

			var lineAtIndex = this.options.lineAtIndex;
			if (lineAtIndex > 0) {
				var point = this.datasets[0].points[lineAtIndex]
				var scale = this.scale
				this.chart.ctx.beginPath();
				this.chart.ctx.moveTo(point.x, scale.startPoint + 24);
				this.chart.ctx.strokeStyle = '#ff0000';
				this.chart.ctx.lineTo(point.x, scale.endPoint);
				this.chart.ctx.stroke();
				this.chart.ctx.textAlign = 'center';
				this.chart.ctx.fillText(point.y.toFixed(1), point.x, scale.startPoint + 12);
			}

		}
	});

	var canvas = document.getElementById('chartContainer');
	var ctx = canvas.getContext('2d');
	var chart = new Chart(ctx, data);

	this.startScan = function() {
		var ds = chart.data.datasets;
		ds[0].data = [];
		ds[1].data = [];
		this.options.lineAtIndex = 0;
		minswr = 999;
		this.redraw();
	}

	this.endScan = function() {
		//do something!
	}

	this.update = function(datapoint) {
		var ds = chart.data.datasets;
		var len = ds[0].data.length;
		var freq = par.range.start + len * (par.range.step);
		var swr = datapoint.swr;
		if (swr < minswr) {
			minswr = swr;
			this.options.lineAtIndex = len - 1;
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

	this.redraw = function() {
		window.requestAnimationFrame(function() {
			chart.update();
		});
	}

	var clicked = false;
	canvas.addEventListener('click', function(evt) {
		var ticks;
		if (!clicked) {
			clicked = true;
			setTimeout(function() {
				if (clicked) {
					//single
					var w = canvas.clientWidth;
					var x = evt.clientX;
					if (x < w / 2) {
						par.prev();
					} else {
						par.next();
					}
					data.options.title.text = par.range.name;
					ticks = data.options.scales.xAxes[0].ticks;
					ticks.min = par.range.start;
					ticks.max = par.range.end;
					that.redraw();
				}
				clicked = false;
			}, 300);
		} else {
			//double
			clicked = false;
			par.checkConnectAndScan();
		}
	});

}
