

/**
 * ALternate graph using Chart.js
 */
org.open60.SwrGraph = function(par) {

  var that = this;

  var swrData = [];
  var iData = [];

  var config = {
      type: 'line',
      data: {
          datasets: [{
              label: 'vswr',
              data: swrData,
              xAxisID: 'X',
              yAxisID: 'A',
              backgroundColor: "rgba(153,255,51,0.6)"
          }, {
              label: 'impedance',
              data: iData,
              xAxisID: 'X',
              yAxisID: 'B',
              backgroundColor: "rgba(255,153,0,0.6)"
          }]
      },
      options: {
          title: {
            display: true,
            text: ''
          },
          scales: {
              yAxes: [{
                  id: 'A',
                  type: 'logarithmic',
                  position: 'left',
                  ticks: {
                    min: 1,
                    max: 10,
                    callback: function(value, index, values) {
                      return Math.floor(value).toString();
                    }
                  }
              }, {
                  id: 'B',
                  type: 'logarithmic',
                  position: 'right',
                  ticks: {
                      min: 1,
                      max: 10000,
                      callback: function(value, index, values) {
                        var s = Math.floor(value).toString();
                        if (s.startsWith('1') || s.startsWith('5')) {
                          return s;
                        }
                      }
                  }
              }],
              xAxes: [
                {
                  id: 'X',
                  type: "linear",
                  position: "bottom",
                  ticks: {
                    min: 13600,
                    max: 14700
                  }
                }
              ]
          }
      }
  };

  var canvas = document.getElementById('chartContainer');
  var ctx = canvas.getContext('2d');
  var chart = new Chart(ctx, config);

  this.startScan = function() {
    swrData = [];
    iData = [];
  }

  this.endScan = function() {
    //do something!
  }

  this.update = function(datapoint) {
    var freq = swrData.length * (par.range.step);
    swrData.push({
      x: freq,
      y: datapoint.swr
    });
    iData.push({
      x: freq,
      y: datapoint.r
    });
    this.redraw();
  }

  this.redraw = function() {
    chart.update();
    chart.render();
  }

  var clicked = false;
	canvas.addEventListener('click', function() {
    var ticks;
		if (!clicked) {
			clicked = true;
			setTimeout(function() {
				if (clicked) {
					//single
					par.next();
          config.options.title.text = par.range.name;
          ticks = config.options.scales.xAxes[0].ticks;
          ticks.min = par.range.start;
          ticks.max = par.range.end;
					that.redraw();
				}
				clicked = false;
			}, 300);
		} else {
			//double
			clicked = false;
			par.checkConnectAndScan();
		}
	});

}
