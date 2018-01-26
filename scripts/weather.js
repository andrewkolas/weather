function loadResponse(response) {
  var times = [],
      temperatures = [],
      backgrounds = [],
      borders = [];

  $(response.properties.periods).each(function () {
    times.push(new Date(this.startTime));
    temperatures.push(this.temperature);
    backgrounds.push(this.isDaytime ? 'rgba(255, 158, 10, 0.1)' : 'rgba(64, 64, 128, 0.1)');
    borders.push(this.isDaytime ? 'rgba(255, 158, 10, 1)' : 'rgba(64, 64, 128, 1)');
  });

  displayGraph(times, temperatures, backgrounds, borders);
}

function displayGraph(times, temperatures, backgrounds, borders) {
  var ctx = $("#weatherGraph").get(0).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: times,
      datasets: [
        {
          label: 'Temp (°F)',
          data: temperatures,
          backgroundColor: backgrounds,
          borderColor: borders,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
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
}

$(document).ready(function () {
  $.ajax({
    url: 'https://api.weather.gov/points/38.7852532,-77.2973747/forecast/hourly',
    success: loadResponse,
    dataType: 'json'
  });
});
