

/**
 * SARK100/Mini50 bluetooth interface
 */
org.open60.App = function() {

	var that = this;

	Object.defineProperties(this, {
		"ready": {
			get: function() {
				return this._ready;
			},
			set: function(v) {
				this._ready = v;
			}
		},
		"connected": {
			get: function() {
				return this._connected;
			},
			set: function(v) {
				var b = document.getElementById("cmd-button");
				if (b) {
					var msg = v ? "disconnect" : "connect";
					b.textContent = msg;
				}
				this._connected = v;
			}
		},
		"range": {
			get: function() {
				return this._range;
			},
      set: function(v) {
        this._range = v;
      }
		}
	});

	this.config = org.open60.config;
	this.ready = false;
	this.connected = false;
	this.rangeIndex = 0;
	this.range = this.config[0];
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

	function next() {
		var len = this.config.ranges.length;
		this.rangeIndex = (this.rangeIndex + 1) % len;
		this.range = this.config.ranges[this.rangeIndex];
	}

	this.checkConnect = function() {
		function success() {
			that.connected = true;
		}

		function failure() {
			that.connected = false;
		}
		bluetoothSerial.isConnected(success, failure);
	};

	this.connect = function(device) {
		function receive(data) {
			that.receive(data);
		}

		function subscribeFailure(msg) {
			error("subscribe: " + msg);
		}

		function connectSuccess() {
			that.connected = true;
			bluetoothSerial.subscribe('\n', receive, subscribeFailure);
			//bluetoothSerial.subscribeRawData(receive, subscribeFailure);
		}

		function connectFailure(msg) {
			that.connected = false;
			error("connect: " + msg);
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
		console.log(data);
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

	this.findMini60AndConnect = function() {
		function success(devices) {
			var dev = devices.find(function(d) {
				var name = d.name;
				return name.startsWith(this.config.deviceName);
			});
			if (!dev) {
				error("Paired device 'MINI60' not found");
			}
			that.connect(dev);
		}

		function failure(msg) {
			error("cannot list paired devices");
		}
		bluetoothSerial.list(success, failure);
	};

	this.scan = function() {
    var ranges = this.config.ranges;
		var start = this.start * 1000;
		var end = this.end * 1000;
		var step = this.step * 1000;
		var cmd = "scan " + start + " " + end + " " + step;
		this.send(cmd);
	};
};
