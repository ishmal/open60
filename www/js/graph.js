/**
 * This is the main canvas
 */
org.open60.Graph = function(par) {

	var that = this;
	this.canvas = document.getElementById('graph');
	this.ctx = this.canvas.getContext("2d");
	this.scanning = false;
	this.data = [];

	this.redraw = function() {
		var ctx = this.ctx;
		var w = this.canvas.width;
		var h = this.canvas.height;
		var range = par.range;
		var name = range.name;
		var start = range.start;
		var end = range.end;
		var step = range.step;
		var datapoints = this.data;
		var dp;
		var datalen = datapoints.length;
		var nrSteps = (end - start) / step;
		var progress = datalen / nrSteps;

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, w, h);
		var top = 10;
		var bottom = h - 20;
		var left = 35;
		var right = w - 35;
		var currentX = left + (right - left) * progress;
		ctx.font = 'bold 12pt Courier';

		/**
		 * Connection
		 */
		var arcEnd = 2.0 * Math.PI;
		var xc = 47;
		var yc = 20;
		var rad = 6;
		ctx.fillStyle = par.connected ? (this.scanning ? "blue" : "green") : "red";
		ctx.beginPath();
		ctx.arc(xc, yc, rad, 0, arcEnd, false);
		ctx.fill();

		/**
		 * Draw columns
		 */
		var nrCol = 20;
		var diff = (right - left) / nrCol;
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 1;
		var x = left;
		var i;
		for (i = 0; i <= nrCol; i++) {
			ctx.beginPath();
			ctx.moveTo(x, top);
			ctx.lineTo(x, bottom);
			ctx.stroke();
			x += diff;
		}

		/**
		 * Draw frequencies
		 */
		x = left - 25;
		var freq = start;
		nrCol = 10;
		var freqDiff = (end - start) / nrCol;
		diff = (right - left) / nrCol;
		for (i = 0; i <= nrCol; i++) {
			ctx.fillStyle = "white";
			ctx.fillText(freq.toFixed(0), x, h - 5);
			x += diff;
			freq += freqDiff;
		}

		/**
		 * Draw rows
		 */
		var nrRow = 20;
		diff = (bottom - top) / nrRow;
		var y = top;
		for (i = 0; i <= nrRow; i++) {
			ctx.beginPath();
			ctx.moveTo(left, y);
			ctx.lineTo(right, y);
			ctx.stroke();
			y += diff;
		}

		/**
		 * Draw SWR and R numbers
		 */
		y = bottom + 2;
		var swr = 1.0;
		var swrDiff = 5.0 / nrRow;
		var r = 0;
		var rDiff = 300 / nrRow;
		for (i = 0; i <= nrRow; i++) {
			ctx.fillStyle = "red";
			ctx.fillText(swr.toFixed(1), 2, y);
			ctx.fillStyle = "#44ff44";
			ctx.fillText(r.toFixed(0), right + 2, y);
			y -= diff;
			swr += swrDiff;
			r += rDiff;
		}

		/**
		 * Draw "cursor"
		 */
		if (progress > 0.01 && progress < 0.99) {
			ctx.strokeStyle = "cyan";
			ctx.beginPath();
			ctx.moveTo(currentX, top);
			ctx.lineTo(currentX, bottom);
			ctx.stroke();
		}

		/**
		 * Draw swr
		 */
		var xd = (right - left) / nrSteps;
		ctx.lineWidth = 4;
		ctx.beginPath();
		x = left;
		ctx.strokeStyle = "red";
		for (i = 0; i < datalen; i++) {
			dp = datapoints[i];
			y = bottom - (bottom - top) * (dp.swr - 1) / 6.0;
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
			x += xd;
		}
		ctx.lineTo(x, y);
		ctx.stroke();


		/**
		 * Draw R
		 */
		ctx.beginPath();
		x = left;
		ctx.strokeStyle = "green";
		for (i = 0; i < datalen; i++) {
			dp = datapoints[i];
			y = bottom - (bottom - top) * (dp.r) / 300.0;
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
			x += xd;
		}
		ctx.lineTo(x, y);
		ctx.stroke();

		/**
		 * Name
		 */
		ctx.fillStyle = "white";
		ctx.fillText(name, 60, 27);

	};

	this.data = [];

	this.startScan = function() {
		this.data = [];
		this.scanning = true;
		this.redraw();
	};

	this.endScan = function() {
		this.scanning = false;
		this.redraw();
	};

	this.update = function(dataPoint) {
		this.data.push(dataPoint);
		this.redraw();
	};

	window.onresize = function() {
		that.redraw();
	};

	setTimeout(function() {
		that.redraw();
	}, 500);

	var clicked = false;
	this.canvas.addEventListener('click', function() {
		if (!clicked) {
			clicked = true;
			setTimeout(function() {
				if (clicked) {
					//single
					par.next();
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

};
