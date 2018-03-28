import SwrGraph from "./swrgraph";
import Config from "./config";
import '@babel/polyfill';

//#######################################################
//# MESSAGES
//#######################################################

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

//#######################################################
//# Promisify bluetoothSerial functions
//#######################################################

function btIsConnected() {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btIsConnected: bluetoothSerial not found");
		} else {
			bluetoothSerial.isConnected(resolve, reject);
		}
	});
}

function btList() {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btList: bluetoothSerial not found");
		} else {
			bluetoothSerial.list(resolve, reject);
		}
	});
}

function btConnect(address) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btConnect: bluetoothSerial not found");
		} else {
			bluetoothSerial.write(address, resolve, reject);
		}
	});
}

function btDisconnect() {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btDisconnect: bluetoothSerial not found");
		} else {
			bluetoothSerial.disconnect(resolve, reject);
		}
	});
}

function btSubscribe(receiveCb) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btSubscribe: bluetoothSerial not found");
		} else {
			bluetoothSerial.subscribe("\n", receiveCb, reject);
		}
	});
}

function btUnsubscribe(receiveCb) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btUnsubscribe: bluetoothSerial not found");
		} else {
			bluetoothSerial.unsubscribe(resolve, reject);
		}
	});
}

function btWrite(msg) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btWrite: bluetoothSerial not found");
		} else {
			bluetoothSerial.write(msg + "\r\n", resolve, reject);
		}
	});
}

//#######################################################
//# M A I N
//#######################################################

/**
 * SARK100/Mini50 bluetooth interface
 */
class App {
	constructor() {
		this.ready = false;
		this.connected = false;
		this.rangeIndex = 0;
		this.config = new Config();
		this.range = this.config.config.ranges[0];
		this.graph = new SwrGraph(this);
		this.startHeartbeat();
	}

	next() {
		let ranges = this.config.config.ranges;
		let len = ranges.length;
		if (++this.rangeIndex >= len) {
			this.rangeIndex = 0;
		}
		this.range = ranges[this.rangeIndex];
	}

	prev() {
		let ranges = this.config.config.ranges;
		let len = ranges.length;
		if (--this.rangeIndex < 0) {
			this.rangeIndex = len - 1;
		}
		this.range = ranges[this.rangeIndex];
	}

	async connect(device) {
		
		try {
			await btConnect(device.address);
			await btSubscribe("\n", (data) => this.receive(data));
		} catch(e) {
			error("connect failure with '" + device.name + "' : " + e);
		}

	}

	async disconnect() {
		if (!this.connected) {
			return;
		}
		try {
			await btUnsubscribe();
			await btDisconnect();
		} catch(e) {
			error("unsubscribe: " + e);
		}
	}

	receive(data) {
		data = data || "";
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

	async send(msg) {
		if (!msg) {
			return;
		}
		try {
			await btWrite(msg + "\r\n");
			//trace("sent!");
		} catch(e) {
			error("send: " + e);
		}
	}

	findDevice(devices) {
		let deviceName = this.config.config.deviceName;
		deviceName = deviceName.toLowerCase();
		let dev = devices.find(d => {
			let name = d.name.toLowerCase();
			return name.startsWith(deviceName);
		});
		if (!dev) {
			error("Paired device '" + deviceName + "' not found");
		}
		return dev;
	}

	async findDeviceAndConnect() {
		try {
			let devices = await btList();
			let dev = this.findDevice(devices);
			if (dev) {
				await this.connect(dev);
			}
		} catch (e) {
			error("findDeviceAndConnect: cannot list paired devices: " + e);
		}
	}

	scan() {
		let r = this.range;
		let start = r.start * 1000;
		let end = r.end * 1000;
		let step = r.step * 1000;
		let cmd = "scan " + start + " " + end + " " + step;
		this.send(cmd);
	}

	async checkConnectAndScan() {
		if (this.connected) {
			return this.scan();
		}
		try {
			await this.findDeviceAndConnect();
			this.scan();
		} catch (e) {
			error("checkConnectAndScan: " + e);
		}
	}

	startHeartbeat() {
		this.timer = setInterval(async () => {
			try {
				this.connected = await btIsConnected();
				this.graph.redraw();
			} catch (e) {
				//error("heartbeat: " + e);  //this message is annoying
			}
		}, 4000);
	}

	stopHeartbeat() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}

export default App;