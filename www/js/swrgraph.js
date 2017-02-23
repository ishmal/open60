/**
 * ALternate graph using Chart.js
 */
org.open60.SwrGraph = function(par) {
  var that = this;
  var minSwr = 999;
  var minSwrFreq = par.range.start;

  var annots = [];

  var data = {
      type: 'line',
      data: {
          datasets: [{
              label: 'vswr',
              data: [],
              xAxisID: 'X',
              yAxisID: 'A',
              fill: false,
              borderWidth: 6,
              borderColor: "rgba(75,255,0,0.6)",
              backgroundColor: "rgba(75,255,0,0.6)"
          }, {
              label: 'impedance',
              data: [],
              xAxisID: 'X',
              yAxisID: 'B',
              fill: false,
              borderWidth: 6,
              borderColor: "rgba(255,75,0,0.6)",
              backgroundColor: "rgba(255,75,0,0.6)"
          }]
      },
      options: {
          animation: false,
          title: {
            display: true,
            text: par.range.name
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
          },
          annotation: {
            drawTime: "afterDraw",
            annotations: annots
          }
      }
  };


  var canvas = document.getElementById('chartContainer');
  var ctx = canvas.getContext('2d');
  var chart = new Chart(ctx, data);

  this.startScan = function() {
    var ds = chart.data.datasets;
    ds[0].data = [];
    ds[1].data = [];
    annots.length = 0;
    minSwr = 999;
    minSwrFreq = par.range.start;
    minR = Number.MAX_VALUE;
    minRFreq = par.range.start;
    this.redraw();
  }

  this.endScan = function() {
    var txt = minSwrFreq.toFixed(1) + '  :  ' + minSwr.toFixed(1);
    var annot = {
      type: 'line',
      mode: 'vertical',
      scaleID: 'X',
      value: minSwrFreq,
      borderColor: 'red',
      borderWidth: 2,
      label: {
          enabled: true,
          content: txt
      }
    };
    annots.push(annot);
    this.redraw();
  }

  this.update = function(datapoint) {
    var ds = chart.data.datasets;
    var len = ds[0].data.length;
    var freq = par.range.start + len * (par.range.step);
    var swr = datapoint.swr;
    if (swr < minSwr) {
      minSwr = swr;
      minSwrFreq = freq;
    }
    ds[0].data.push({
      x: freq,
      y: swr
    });
    ds[1].data.push({
      x: freq,
      y: datapoint.r
    });
    this.redraw();
  }

	this.redraw = function() {
		window.requestAnimationFrame(function() {
			chart.update(0);
		});
	}

	var clicked = false;
	canvas.addEventListener('click', function(evt) {
		var ticks;
		if (!clicked) {
			clicked = true;
			setTimeout(function() {
				if (clicked) {
					//single
					var w = canvas.clientWidth;
					var x = evt.clientX;
					if (x < w / 2) {
						par.prev();
					} else {
						par.next();
					}
					data.options.title.text = par.range.name;
					ticks = data.options.scales.xAxes[0].ticks;
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
