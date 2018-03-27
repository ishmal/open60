cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-toaster.notification",
        "file": "plugins/cordova-plugin-toaster/www/toaster.js",
        "pluginId": "cordova-plugin-toaster",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
        "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
        "pluginId": "cordova-plugin-bluetooth-serial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.1",
    "cordova-plugin-toaster": "0.0.1",
    "cordova-plugin-bluetooth-serial": "0.4.6"
};
// BOTTOM OF METADATA
});