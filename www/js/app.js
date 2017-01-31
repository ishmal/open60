

/**
 * SARK100/Mini50 bluetooth interface
 */
org.open60.App = function() {

	var that = this;

	this.ready = false;
	this.connected = false;
	this.rangeIndex = 0;
	this.range = org.open60.config.ranges[0];
  this.graph = new org.open60.Graph(this);

	function trace(msg) {
		console.log(msg);
	}

	function alert(msg) {
		if (navigator.showToast) {
			navigator.showToast(msg);
		}
		console.log("alert: " + msg);
	}

	function error(msg) {
		console.log("error: " + msg);
		if (navigator.showToast) {
			navigator.showToast(msg);
		}
	}

	this.next = function() {
		var ranges = org.open60.config.ranges;
		var len = ranges.length;
		this.rangeIndex = (this.rangeIndex + 1) % len;
		this.range = ranges[this.rangeIndex];
	}

	this.checkConnect = function() {
		function success() {
			that.connected = true;
		}

		function failure() {
			that.connected = false;
		}
		if (typeof bluetoothSerial !== "undefined") {
			bluetoothSerial.isConnected(success, failure);
		}
	};

	this.connect = function(device, cb) {
		function receive(data) {
			that.receive(data);
		}

		function subscribeFailure(msg) {
			error("subscribe: " + msg);
		}

		function connectSuccess() {
			that.connected = true;
			bluetoothSerial.subscribe('\n', receive, subscribeFailure);
			if (cb) {
				cb();
			}
		}

		function connectFailure(msg) {
			that.connected = false;
			error("connecting to '" + device.name + "' : " + msg);
		}
		bluetoothSerial.connect(device.address, connectSuccess, connectFailure);
	};

	this.disconnect = function() {
		function success() {
			that.connected = false;
		}

		function failure(msg) {
			that.connected = false;
		}
		if (that.connected) {
			bluetoothSerial.unsubscribe();
			bluetoothSerial.disconnect(success, failure);
		}
	};

	this.receive = function(data) {
		// console.log(data);
		data = data.trim();
		if (data.startsWith('Start')) {
			this.graph.startScan();
		} else if (data.startsWith("End")) {
			this.graph.endScan();
		} else {
			var arr = data.split(',');
			if (arr.length === 4) {
				var dp = {
					swr: parseFloat(arr[0]),
					r: parseFloat(arr[1]),
					x: parseFloat(arr[2]),
					z: parseFloat(arr[3])
				};
				this.graph.update(dp);
			}
		}
	};

	this.send = function(msg) {
		if (!this.connected) {
			return;
		}

		function success() {
			trace("sent!");
		}

		function failure(msg) {
			error("send: " + msg);
		}
		bluetoothSerial.write(msg + '\r\n', success, failure);
	};

	this.findDeviceAndConnect = function(cb) {
		var deviceName = this.config.deviceName;
		function success(devices) {
			var dev = devices.find(function(d) {
				var name = d.name;
				return name.startsWith(deviceName);
			});
			if (!dev) {
				error("Paired device '" + deviceName + "' not found");
			}
			that.connect(dev, cb);
		}

		function failure(msg) {
			error("cannot list paired devices");
		}
		bluetoothSerial.list(success, failure);
	};

	this.scan = function() {
			var r = this.range;
			var start = r.start * 1000;
			var end = r.end * 1000;
			var step = r.step * 1000;
			var cmd = "scan " + start + " " + end + " " + step;
			this.send(cmd);
	};

	this.checkConnectAndScan = function() {
		if (this.connected) {
			this.scan();
		} else {
			this.findDeviceAndConnect(function() {
				that.scan();
			});
		}
	};

	this.startHeartbeat = function() {
		this.timer = setInterval(function() {
			function success() {
				that.connected = true;
			}
			function failure() {
				that.connected = false;
			}
			if (typeof bluetoothSerial !== 'undefined') {
				bluetoothSerial.isConnected(success, failure);
			} else {
				that.connected = false;
			}
			that.graph.redraw();
		}, 3000);
	};

	this.setup = function() {
		this.startHeartbeat();
	}

	this.setup();

};
