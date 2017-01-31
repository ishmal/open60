


/**
 * Cnfiguration file.  Modify at will!!  Enjoy
 */
org.open60.defaultConfig = {
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
    }
  ]
};

// clone
org.open60.config = window.localStorage.get("open60");
if (!org.open60.config) {
  org.open60.config = JSON.parse(JSON.stringify(org.open60.defaultConfig));
}
