function loadResponse(response) {
  var times = [],
      temperatures = [],
      backgrounds = [],
      borders = [];

  $(response.properties.periods).each(function () {
    times.push(new Date(this.startTime));
    temperatures.push(this.temperature);
    backgrounds.push(this.isDaytime ? 'rgba(255, 158, 10, 0.5)' : 'rgba(24, 71, 150, 0.4)');
  });

  displayGraph(times, temperatures, backgrounds, borders);
}

function displayGraph(times, temperatures, backgrounds) {
  var ctx = $("#weatherGraph").get(0).getContext('2d');
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
}

$(document).ready(function () {
  $.ajax({
    url: 'https://api.weather.gov/points/38.7852532,-77.2973747/forecast/hourly',
    success: loadResponse,
    dataType: 'json'
  });

  $.ajax({
    url: 'https://api.weather.gov/points/38.7852532,-77.2973747/forecast',
    success: loadPrecipitationResponse,
    dataType: 'json'
  });

});

function loadPrecipitationResponse(response) {
  var times = [],
      percentages = [];

  $(response.properties.periods).each(function () {

    var precipString = /Chance of precipitation is \d+%/.exec(this.detailedForecast),
        precipPercent = precipString ? Number(/\d+/.exec(precipString[0])[0]) : 0;

    for (var i=0; i<12; i++){
      times.push(addHours(this.startTime, i));
      percentages.push(precipPercent);
    }
  });

  displayPrecipitationGraph(times.slice(0,156), percentages.slice(0,156));
}

function displayPrecipitationGraph(times, precipitationPercentages) {
  var ctx = $("#precipGraph").get(0).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: times,
      datasets: [
        {
          label: 'Precip %',
          data: precipitationPercentages,
          backgroundColor: 'rgba(112, 166, 255, .5)'
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
}

function addHours(dateString, h){
  var date = new Date(dateString);
  date.setHours(date.getHours()+h);
  return date;
}
