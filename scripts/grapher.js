var Grapher = {

  dayTimeOrange: 'rgba(255, 158, 10, 0.5)',
  nightTimeBlue: 'rgba(24, 71, 150, 0.4)',
  rainyBlue: 'rgba(112, 166, 255, .5)',

  /**
   * Renders the temperature graph, showing day and night hours in different colors
   * Takes 3 parallel Arrays, because that's how Chart.js likes data
   * @param times An Array of times that will correspond to each of the temperatures
   * @param temperatures The Array of temperatures at the given times
   * @param daylightHours An Array of boolean values, signifying if the given hour is day or night
   */
  displayTemperatureGraph: function (times, temperatures, daylightHours) {
    var ctx = $("#temperatureGraph").get(0).getContext('2d'),
        backgrounds = this._colorDaylightHours(daylightHours);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: times,
        datasets: [
          {
            label: 'Temp (°F)',
            data: temperatures,
            backgroundColor: backgrounds
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            barPercentage: 1,
            categoryPercentage: 1,
            time: {
              unit: 'day'
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  },

  /**
   * Renders the precipitation graph
   * Takes 2 parallel Arrays, because that's how Chart.js likes data
   * @param times An Array of times that will correspond to each of the precipitation percentages
   * @param temperatures The Array of precipitation percentages at the given times
   */
  displayPrecipitationGraph: function(times, precipitationPercentages) {
    var ctx = $("#precipitationGraph").get(0).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: times,
        datasets: [
          {
            label: 'Precip %',
            data: precipitationPercentages,
            backgroundColor: this.rainyBlue
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            barPercentage: 1,
            categoryPercentage: 1,
            time: {
              unit: 'day'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              stepSize: 25
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  },

  _colorDaylightHours: function(daylightHours){
    var self = this;
    return $(daylightHours).map(function (index) {
      return daylightHours[index] ? self.dayTimeOrange : self.nightTimeBlue;
    }).get();
  }

};
