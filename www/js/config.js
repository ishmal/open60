


/**
 * Cnfiguration file.  Modify at will!!  Enjoy
 */
org.open60.defaultConfig = {
  ns: "org.open60",
  deviceName : "MINI60",
  ranges : [
    {
      name: "160m",
      start: 1750,
      end: 2050,
      step: 5
    },
    {
      name: "80/75m",
      start: 3400,
      end: 4100,
      step: 10
    },
    {
      name: "60m",
      start: 5250,
      end: 5450,
      step: 5
    },
    {
      name: "40m",
      start: 6900,
      end: 7400,
      step: 5
    },
    {
      name: "30m",
      start: 10050,
      end: 10300,
      step: 5
    },
    {
      name: "20m",
      start: 13800,
      end: 14700,
      step: 5
    },
    {
      name: "17m",
      start: 18000,
      end: 18250,
      step: 5
    },
    {
      name: "15m",
      start: 20500,
      end: 22000,
      step: 5
    },
    {
      name: "12m",
      start: 24700,
      end: 25100,
      step: 5
    },
    {
      name: "10m",
      start: 27900,
      end: 30000,
      step: 10
    },
    {
      name: "6m",
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

// clone
org.open60.config = JSON.parse(window.localStorage.getItem("open60") || "{}");
if (!org.open60.config || org.open60.config.ns !== 'org.open60') {
  var json = JSON.stringify(org.open60.defaultConfig);
  window.localStorage.setItem("open60", json);
  org.open60.config = JSON.parse(json);
}


Vue.component('config-component', {
  template: '\n' +
    '<div class="config-pane">\n' +
    '<button v-on:click="save()" type="button" class="btn btn-primary" >Save</button>\n' +
    '<button v-on:click="restore()"  type="button" class="btn btn-primary">Restore defaults</button>\n' +
    '<label>Bluetooth Device<input type="text" v-model="config.deviceName" /></label>\n' +
    '<table class="table table-sm table-striped" cols="4">\n' +
    '<thead><th>name</th><th>start khz</th><th>end khz</th><th>step khz</th></thead>\n' +
    '<tbody>\n' +
    '<tr v-for="r in config.ranges">\n' +
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
      config: org.open60.config
    };
  },
  methods: {
    save: function() {
      var json = JSON.stringify(org.open60.config);
      window.localStorage.setItem("open60", json);
    },
    restore: function() {
      var json = JSON.stringify(org.open60.defaultConfig);
      window.localStorage.setItem("open60", json);
      var clone = JSON.parse(json);
      org.open60.config = clone;
    }
  }
});
