/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function Graph() {

	this.canvas = document.getElementById('graph');
	this.ctx = this.canvas.getContext("2d");

	this.redraw = function() {
		var ctx = this.ctx;
		var w = this.canvas.width;
		var h = this.canvas.height;
		var start = this.start;
		var end = this.end;
		var step = this.step;
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
		for (i = 0; i <= nrCol ; i++) {
			ctx.beginPath()
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
		for (i = 0; i <= nrCol ; i++) {
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
		for (i = 0; i <= nrRow ; i++) {
			ctx.beginPath()
			ctx.moveTo(left, y);
			ctx.lineTo(right, y);
			ctx.stroke();
			y += diff;
		}

		/**
		 * Draw SWR and R numbers
		 */
		var y = bottom + 2;
		var swr = 1.0;
		var swrDiff = 5.0 / nrRow;
		var r = 0;
		var rDiff = 300 / nrRow;
		for (i = 0; i <= nrRow ; i++) {
			ctx.fillStyle = "red";
			ctx.fillText(swr.toFixed(1), 2, y);
			ctx.fillStyle = "green";
			ctx.fillText(r.toFixed(0), right + 2, y);
			y -= diff;
			swr += swrDiff;
			r += rDiff;
		}

	};

	Object.defineProperties(this, {
		"start": { 
			get: function () { return this._start },
			set: function(v) { this._start = v; this.redraw(); }
			},
		"end": { 
			get: function () { return this._end; },
			set: function(v) { this._end = v; this.redraw(); }
			},
		"step": { 
			get: function () { return this._step; },
			set: function(v) { this._step = v; this.redraw(); }
			},
	});

	this.start = 13900;
	this.end = 14500;
	this.step = 5;
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

}
 

function Open60App() {

		var that = this;

		Object.defineProperties(this, {
			"ready": { 
				get: function () { return this._ready; },
				set: function(v) { this._ready = v }
			 },
			"connected": { 
				get: function () { return false; }  // bluetoothSerial.isConnected;0
			 },
			"start": { 
				get: function () { return this._start; },
				set: function(v) { this._start = v; if (this.graph) this.graph.start = v; }
			 },
			"end": { 
				get: function () { return this._end; },
				set: function(v) { this._end = v;  if (this.graph) this.graph.end = v; }
			},
			"step": { 
				get: function () { return this._step; },
				set: function(v) { this._step = v;  if (this.graph) this.graph.step = v; }
			 },
		});

		this.ready = false;
		this.start = 14000.0;
		this.end = 14350.0;
		this.step = 5;

		function trace(msg) {
			console.log(msg);
		}
    
		function error(msg) {
			console.log("error: " + msg);
		}

		this.addGraph = function() {
			this.graph = new Graph(this.start, this.end, this.step);
		}
    
		this.connect = function(device) {
			function receive(data) {
				that.receive(data);
			}
			function subscribeFailure(msg) {
				error("subscribe: " + msg);
			}
			function connectSuccess() {
				bluetoothSerial.subscribe('\n', receive, subscribeFailure)
			}
			function connectFailure(msg) {
				error("connect: " + msg);
			}
			bluetoothSerial.connect(device.id, connectSuccess. connectFailure);
		};

		this.disconnect = function() {
			function success() {

			}
			function failure(msg) {

			}
			if (bluetoothSerial.isConnected) {
				bluetoothSerial.unsubscribe();
				bluetoothSerial.disconnect(success, failure);
			}
		};

		this.receive = function(data) {
			console.log(data);
		};

		this.send = function(msg) {
			function success() {

			}
			function failure(msg) {
				error("send: " + msg);
			}
			bluetoothSerial.write(msg, success, failure);
		};

		this.findMini60AndConnect = function() {
			function success(devices) {
				var dev = devices.find(function(d) {
					var name = d.name;
					return name.startsWith("MINI60");
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
			var start = this.start * 1000;
			var end = this.end * 1000;
			var step = this.step * 1000;
			var cmd = "scan " + start + " " + end + " " + step;
			this.send(cmd);
		};

		var toolbarComponent = {
			template: '\
			<div>\
			<span>{{ connected }} </span>\
			<button v-on:click="connect()">connect</button>\
			<button v-on:click="disconnect()">disconnect</button>\
			<span>start</span><input v-model="start">\
			<span>end</span><input v-model="end">\
			<span>step</span><input v-model="step">\
			<button v-on:click="scan()">scan</button>\
			</div>\
			',
			data: function() {
				return {
					connected: that.connected,
					start: that.start,
					end: that.end,
					step: that.step,
				}
			},
			methods: {
				connect: function() {
					that.findMini60AndConnect();
				},
				disconnect: function() {
					that.disconnect();
				},
				scan: function() {
					that.scan();	
				}
			}
		};

		Vue.component('toolbar-component', toolbarComponent);
		
		this.refreshDevices = function() {
			if (typeof bluetoothSerial !== "undefined") {
				function success(devices) {
					btData.devices = devices.slice(0);
				}
				function failure(msg) {
					console.log("bluetooth list error: " + msg);
				}
				bluetoothSerial.list(success, failure);
			} else {
				btData.devices = [
					{
					name: "device1"
					},
					{
					name: "device2"
					},
					{
					name: "device3"
					}
				];
			}
		};
		
		function onDeviceReady() {
			that.ready = true;
		}

		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			document.addEventListener("deviceready", onDeviceReady, false);
		} else {
			onDeviceReady(); //this is a browser
		}

}

var open60app = new Open60App();

document.addEventListener("DOMContentLoaded", function() {
	open60app.addGraph();
	var app = new Vue({
		el: '#app',
		data: {
		}
	});
});

