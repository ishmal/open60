import SwrGraph from "./swrgraph";
import config from "./config";

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


/**
 * SARK100/Mini50 bluetooth interface
 */
class App {
	constructor() {

		this.ready = false;
		this.connected = false;
		this.rangeIndex = 0;
		this.range = config.ranges[0];
		this.graph = new SwrGraph(this);
		this.startHeartbeat();
	}

	next() {
		let ranges = config.ranges;
		let len = ranges.length;
		if (++this.rangeIndex >= len) {
			this.rangeIndex = 0;
		}
		this.range = ranges[this.rangeIndex];
	}

	prev() {
		let ranges = config.ranges;
		let len = ranges.length;
		if (--this.rangeIndex < 0) {
			this.rangeIndex = len - 1;
		}
		this.range = ranges[this.rangeIndex];
	}

	checkConnect() {
		function success() {
			that.connected = true;
		}

		function failure() {
			that.connected = false;
		}
		if (typeof bluetoothSerial !== "undefined") {
			bluetoothSerial.isConnected(success, failure);
		}
	}

	connect(device, cb) {
		let that = this;

		function receive(data) {
			that.receive(data);
		}

		function subscribeFailure(msg) {
			error("subscribe failure: " + msg);
		}

		function connectSuccess() {
			that.connected = true;
			alert("connected");
			bluetoothSerial.subscribe("\n", receive, subscribeFailure);
			if (cb) {
				cb();
			}
		}

		function connectFailure(msg) {
			that.connected = false;
			error("connect failure with '" + device.name + "' : " + msg);
		}
		bluetoothSerial.connect(device.address, connectSuccess, connectFailure);
	}

	disconnect() {
		let that = this;

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

	receive(data) {
		// console.log(data);
		data = data.trim();
		if (data.startsWith("Start")) {
			this.graph.startScan();
		} else if (data.startsWith("End")) {
			this.graph.endScan();
		} else {
			let arr = data.split(",");
			if (arr.length === 4) {
				let dp = {
					swr: parseFloat(arr[0]),
					r: parseFloat(arr[1]),
					x: parseFloat(arr[2]),
					z: parseFloat(arr[3])
				};
				this.graph.update(dp);
			}
		}
	}

	send(msg) {
		if (!this.connected) {
			return;
		}

		function success() {
			trace("sent!");
		}

		function failure(msg) {
			error("send failure: " + msg);
		}
		bluetoothSerial.write(msg + "\r\n", success, failure);
	}

	findDeviceAndConnect(cb) {
		let deviceName = config.deviceName;
		deviceName = deviceName.toLowerCase();

		function success(devices) {
			let dev = devices.find(function (d) {
				let name = d.name.toLowerCase();
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
	}

	scan() {
		let r = this.range;
		let start = r.start * 1000;
		let end = r.end * 1000;
		let step = r.step * 1000;
		let cmd = "scan " + start + " " + end + " " + step;
		this.send(cmd);
	}

	checkConnectAndScan() {
		let that = this;
		if (this.connected) {
			this.scan();
		} else {
			this.findDeviceAndConnect(() => that.scan());
		}
	}

	startHeartbeat() {
		let that = this;
		this.timer = setInterval(() => {
			function success() {
				that.connected = true;
			}
			function failure() {
				that.connected = false;
			}
			if (typeof bluetoothSerial !== "undefined") {
				bluetoothSerial.isConnected(success, failure);
			} else {
				that.connected = false;
			}
			that.graph.redraw();
		}, 4000);
	};

	stopHeartbeat() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}


}

export default App;