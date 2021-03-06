/* jshint esversion: 6 */

import Rx from "rxjs/Rx";

/**
 * Configuration file.  Modify at will!!  Enjoy
 */
const defaultConfig = {
	id: "Open60Config",
	deviceName: "mini",
	ranges: [
		{
			name: "160 m",
			start: 1750,
			end: 2050
		},
		{
			name: "80/75 m",
			start: 3400,
			end: 4100
		},
		{
			name: "60 m",
			start: 5250,
			end: 5450
		},
		{
			name: "40 m",
			start: 6900,
			end: 7400
		},
		{
			name: "30 m",
			start: 10050,
			end: 10300
		},
		{
			name: "20 m",
			start: 13800,
			end: 14700
		},
		{
			name: "17 m",
			start: 18000,
			end: 18250
		},
		{
			name: "15 m",
			start: 20800,
			end: 21700
		},
		{
			name: "12 m",
			start: 24700,
			end: 25100
		},
		{
			name: "10 m",
			start: 27900,
			end: 30000
		},
		{
			name: "6 m",
			start: 49800,
			end: 54200
		},
		{
			name: "custom 1",
			start: 1500,
			end: 30000
		},
		{
			name: "custom 2",
			start: 1500,
			end: 30000
		}
	]
};

class Config {
	constructor() {
		this.config = JSON.parse(JSON.stringify(defaultConfig));
		this.anchor = document.getElementById("config");
		this.load();
	}

	restore() {
		let json = JSON.stringify(defaultConfig);
		window.localStorage.setItem("open60", json);
		this.config = JSON.parse(json);
		this.render();
	}

	load() {
		try {
			let cfg = JSON.parse(window.localStorage.getItem("open60") || "{}");
			this.config = cfg;
			this.render();
		} catch(e) {
			this.restore();
		}
	}

	save() {
		let json = JSON.stringify(this.config);
		window.localStorage.setItem("open60", json);
	}

	render() {
		let c = this.config;
		let ranges = c.ranges;
		let buf = "";
		ranges.forEach(r => {
			let row = `
			<tr>
			<td><input type="text"   value="${r.name}"/></td>
			<td><input type="number" value="${r.start}"/></td>
			<td><input type="number" value="${r.end}"/></td>
			</tr>
			`;
			buf += row;
		});

		let html = `
		<div class="config-form">
		<button id="config-save" class="btn btn-primary" >Save</button>
		<button id="config-restore" class="btn btn-primary">Restore defaults</button>
		<label>Bluetooth Device name <input id="config-device" type="text" value="${
			c.deviceName
		}"/></label>
		<table class="table table-sm table-striped" cols="3">
		<thead><th>name</th><th>start khz</th><th>end khz</th></thead>
		<tbody>
		${buf}
		</tbody>
		</table>
		</div>
		`;
		this.anchor.innerHTML = html;

		function getInt(s) {
			try {
				return Math.round(parseFloat(s));
			} catch(e) {
				return 0;
			}
		}

		let saveBtn = document.getElementById("config-save");
		saveBtn.addEventListener("click", () => this.save());
		let restoreBtn = document.getElementById("config-restore");
		restoreBtn.addEventListener("click", () => this.restore());
		let deviceTxt = document.getElementById("config-device");
		Rx.Observable.fromEvent(deviceTxt, "input")
			.map(e => e.target.value)
			.subscribe(v => (c.deviceName = v));
		let rows = document.querySelectorAll(".config-form tbody tr");
		function setUpObservable(cols, r) {
			Rx.Observable.fromEvent(cols[0], "input")
				.map(e => e.target.value)
				.subscribe(v => {
					r.name = v.trim();
				});
			Rx.Observable.fromEvent(cols[1], "input")
				.map(e => e.target.value)
				.subscribe(v => {
					r.start = getInt(v);
				});
			Rx.Observable.fromEvent(cols[2], "input")
				.map(e => e.target.value)
				.subscribe(v => {
					r.end = getInt(v);
				});
		}
		for (let i = 0, len = rows.length; i < len; i++) {
			let row = rows[i];
			let cols = row.querySelectorAll("input");
			let range = ranges[i];
			setUpObservable(cols, range);
		}
	}
}

export default Config;
