
(function() {

/**
 * Cnfiguration file.  Modify at will!!  Enjoy
 */
org.open60.defaultConfig = {
  ns: "org.open60",
  deviceName : "mini",
  ranges : [
    {
      name: "160m",
      start: 1750,
      end: 2050,
      step: 5
    },
    {
      name: "80/75 m",
      start: 3400,
      end: 4100,
      step: 10
    },
    {
      name: "60 m",
      start: 5250,
      end: 5450,
      step: 5
    },
    {
      name: "40 m",
      start: 6900,
      end: 7400,
      step: 5
    },
    {
      name: "30 m",
      start: 10050,
      end: 10300,
      step: 5
    },
    {
      name: "20 m",
      start: 13800,
      end: 14700,
      step: 5
    },
    {
      name: "17 m",
      start: 18000,
      end: 18250,
      step: 5
    },
    {
      name: "15 m",
      start: 20500,
      end: 22000,
      step: 5
    },
    {
      name: "12 m",
      start: 24700,
      end: 25100,
      step: 5
    },
    {
      name: "10 m",
      start: 27900,
      end: 30000,
      step: 10
    },
    {
      name: "6 m",
      start: 49800,
      end: 54200,
      step: 10
    },
    {
      name: "wide",
      start: 1500,
      end: 30000,
      step: 200
    }
  ]
};

function restoreConfig() {
  var json = JSON.stringify(org.open60.defaultConfig);
  window.localStorage.setItem("open60", json);
  org.open60.config = JSON.parse(json);
}

function loadConfig() {
  var cfg = JSON.parse(window.localStorage.getItem("open60") || "{}");
  if (!cfg || cfg.ns !== 'org.open60') {
    restoreConfig();
  } else {
    org.open60.config = cfg;
  }
}

function saveConfig() {
  var json = JSON.stringify(org.open60.config);
  window.localStorage.setItem("open60", json);
}

loadConfig();

Vue.component('config-component', {
  template: '\n' +
    '<div class="config-pane">\n' +
    '<button v-on:click="save()" type="button" class="btn btn-primary" >Save</button>\n' +
    '<button v-on:click="restore()"  type="button" class="btn btn-primary">Restore defaults</button>\n' +
    '<label>Bluetooth Device<input type="text" v-model="ns.config.deviceName" /></label>\n' +
    '<table class="table table-sm table-striped" cols="4">\n' +
    '<thead><th>name</th><th>start khz</th><th>end khz</th><th>step khz</th></thead>\n' +
    '<tbody>\n' +
    '<tr v-for="r in ns.config.ranges">\n' +
    '<td><input type="text" v-model="r.name" /></td>\n' +
    '<td><input type="number" v-model="r.start" /></td>\n' +
    '<td><input type="number" v-model="r.end" /></td>\n' +
    '<td><input type="number" v-model="r.step" /></td>\n' +
    '</tr>\n' +
    '</tbody>\n' +
    '</table>\n' +
    '</div>\n',
  data: function() {
    return {
      ns: org.open60
    };
  },
  methods: {
    save: function() {
      saveConfig();
    },
    restore: function() {
      restoreConfig();
    }
  }
});



})(); //IIFE
