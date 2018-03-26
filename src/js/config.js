import Vue from "vue/dist/vue.esm";

/**
 * Configuration file.  Modify at will!!  Enjoy
 */
const defaultConfig = {
  id: "Open60Config",
  deviceName : "mini",
  ranges : [
    {
      name: "160 m",
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
      step: 10
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
      step: 15
    },
    {
      name: "17 m",
      start: 18000,
      end: 18250,
      step: 5
    },
    {
      name: "15 m",
      start: 20800,
      end: 21700,
      step: 20
    },
    {
      name: "12 m",
      start: 24700,
      end: 25100,
      step: 10
    },
    {
      name: "10 m",
      start: 27900,
      end: 30000,
      step: 25
    },
    {
      name: "6 m",
      start: 49800,
      end: 54200,
      step: 15
    },
    {
      name: "custom 1",
      start: 1500,
      end: 30000,
      step: 200
    },
    {
      name: "custom 2",
      start: 1500,
      end: 30000,
      step: 200
    }
  ]
};

let config = JSON.parse(JSON.stringify(defaultConfig));

function restoreConfig() {
  var json = JSON.stringify(defaultConfig);
  window.localStorage.setItem("open60", json);
  config = JSON.parse(json);
}

function loadConfig() {
  var cfg = JSON.parse(window.localStorage.getItem("open60") || "{}");
  if (!cfg || cfg.id !== "Open60Config") {
    restoreConfig();
  } else {
    config = cfg;
  }
}

function saveConfig() {
  var json = JSON.stringify(config);
  window.localStorage.setItem("open60", json);
}

loadConfig();

Vue.component("config-component", {
  template: `
    <div class="config-pane">
    <button v-on:click="save()" type="button" class="btn btn-primary" >Save</button>
    <button v-on:click="restore()"  type="button" class="btn btn-primary">Restore defaults</button>
    <label>Bluetooth Device <input type="text" v-model="config.deviceName" /></label>
    <table class="table table-sm table-striped" cols="4">
    <thead><th>name</th><th>start khz</th><th>end khz</th><th>step khz</th></thead>
    <tbody>
    <tr v-for="r in config.ranges">
    <td><input type="text" v-model="r.name" /></td>
    <td><input type="number" v-model="r.start" /></td>
    <td><input type="number" v-model="r.end" /></td>
    <td><input type="number" v-model="r.step" /></td>
    </tr>
    </tbody>
	</table>
	</div>
    `,
  data: function() {
    return {
      config: config
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

export default config;

