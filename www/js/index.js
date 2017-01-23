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
function Open60App() {

    function constructor() {
		
		var btData = {
			devices : []
		};
		
		var btComponent = {
			template: '\
				<div>\
				<button :click="refresh()">refresh</button>\
				<ul>\
				<li v-for="d in devices">{{ d.name }}</li>\
				</ul>\
				</div>\
				',
			data: function() {
				return btData;
				},
			methods: {
				refresh: function() {
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
				}
			}
		};
		
    	var app = new Vue({
  			el: '#app',
  			data: {
    			message: 'Hello Vue!'
  			},
  			components: {
  				'bluetooth-component': btComponent
  			}
		});
		
    };


	constructor();
}


function onDeviceReady() {
	var openApp = new Open60App();
}

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  onDeviceReady(); //this is the browser
}