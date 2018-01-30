var WeatherLoader = {

  weatherApiRoot: 'https://api.weather.gov/',

  init: function(){
    //TODO provide a search
    var address = (new URLSearchParams(window.location.search)).get('address');
    Geocoder.findCoordinates(address || 22015, this.requestWeatherData, this);
  },

  /**
   * Initiates ajax requests to the National Weather Service, for the given location
   * @param latitude
   * @param longitude
   */
  requestWeatherData: function (latitude, longitude) {
    $.ajax({
      url: this.weatherApiRoot + 'points/'+latitude+','+longitude +'/forecast/hourly',
      success: this.loadHourlyData,
      dataType: 'json'
    });

    $.ajax({
      url: this.weatherApiRoot + 'points/'+latitude+','+longitude +'/forecast',
      success: this.loadForecastData,
      dataType: 'json'
    });
  },

  /**
   * Hourly forecast data, used here to load the hourly temperature graph
   * @param jsonData Response from NWS api
   */
  loadHourlyData: function(jsonData) {
    var times = [],
        temperatures = [],
        backgrounds = [],
        borders = [];

    $(jsonData.properties.periods).each(function () {
      times.push(new Date(this.startTime));
      temperatures.push(this.temperature);
      backgrounds.push(this.isDaytime);
    });

    Grapher.displayTemperatureGraph(times, temperatures, backgrounds, borders);
  },

  /**
   * Forecast data comes in periods (Tuesday, Tuesday night, etc)
   * It contains a detailedForecast which is parseable to collect precipitation percentages.
   * @param jsonData Response from NWS api
   */
  loadForecastData: function(jsonData){
    var times = [],
        percentages = [];

    $(jsonData.properties.periods).each(function () {

      var precipString = /Chance of precipitation is \d+%/.exec(this.detailedForecast),
          precipPercent = precipString ? Number(/\d+/.exec(precipString[0])[0]) : 0;

      //Break each 12 hour period into 12 segments, to mimic the scale of the hourly temp graph
      for (var i=0; i<12; i++){
        times.push(WeatherLoader._addHours(this.startTime, i));
        percentages.push(precipPercent);
      }
    });

    Grapher.displayPrecipitationGraph(times.slice(0,156), percentages.slice(0,156));
  },

  _addHours: function (dateString, hours) {
    var date = new Date(dateString);
    date.setHours(date.getHours() + hours);
    return date;
  }
};
