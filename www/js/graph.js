/**
 * This is the main canvas
 */
org.open60.Graph = function(par) {

	var that = this;
	this.canvas = document.getElementById('graph');
	this.ctx = this.canvas.getContext("2d");
	this.data = [];

	this.redraw = function() {
		var ctx = this.ctx;
		var w = this.canvas.width;
		var h = this.canvas.height;
		var range = par.range;
		var start = range.start;
		var end = range.end;
		var step = range.step;
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, w, h);
		var top = 10;
		var bottom = h - 20;
		var left = 35;
		var right = w - 35;
		ctx.font = 'bold 12pt Courier';

		/**
		 * Draw columns
		 */
		var nrCol = 20;
		var diff = (right - left) / nrCol;
		ctx.strokeStyle = "yellow";
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
			ctx.fillStyle = "green";
			ctx.fillText(r.toFixed(0), right + 2, y);
			y -= diff;
			swr += swrDiff;
			r += rDiff;
		}

		/**
		 * Draw swr
		 */
		var datapoints = this.data;
		var p;
		var len = datapoints.length;
		var nrSteps = (this.end - this.start) / this.step;
		var xd = (right - left) / nrSteps;
		ctx.beginPath();
		x = left;
		ctx.strokeStyle = "red";
		for (i = 0; i < len; i++) {
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
	};

	this.data = [];

	this.startScan = function() {
		this.data = [];
		this.redraw();
	};

	this.endScan = function() {
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
	}, 2000);

	this.canvas.addEventListener('click', function() {
		par.next();
		this.redraw();
	});

	this.canvas.addEventListener('dblclick', function() {
		par.scan();
	});

};
