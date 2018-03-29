/* jshint esversion: 6 */

//#######################################################
//# Promisify bluetoothSerial functions
//#######################################################

export function btIsConnected() {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btIsConnected: bluetoothSerial not found");
		} else {
			bluetoothSerial.isConnected(resolve, reject);
		}
	});
}

export function btList() {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btList: bluetoothSerial not found");
		} else {
			bluetoothSerial.list(resolve, reject);
		}
	});
}

export function btConnect(address) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btConnect: bluetoothSerial not found");
		} else {
			bluetoothSerial.connect(address, resolve, reject);
		}
	});
}

export function btDisconnect() {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btDisconnect: bluetoothSerial not found");
		} else {
			bluetoothSerial.disconnect(resolve, reject);
		}
	});
}


export function btSubscribe(receiveCb) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btSubscribe: bluetoothSerial not found");
		} else {
			let failMsg = null;
			bluetoothSerial.subscribe("\n", receiveCb, (err) => { failMsg = err; });
			setTimeout(() => {
				if (failMsg) {
					reject(failMsg);
				} else {
					resolve(true);
				}
			}, 500);
		}
	});
}

export function btUnsubscribe(receiveCb) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btUnsubscribe: bluetoothSerial not found");
		} else {
			bluetoothSerial.unsubscribe(resolve, reject);
		}
	});
}

export function btWrite(msg) {
	return new Promise((resolve, reject) => {
		if (typeof bluetoothSerial === "undefined") {
			reject("btWrite: bluetoothSerial not found");
		} else {
			bluetoothSerial.write(msg + "\r\n", resolve, reject);
		}
	});
}

