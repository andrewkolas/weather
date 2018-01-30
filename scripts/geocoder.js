var Geocoder = {

  geocodio_api_url: 'https://api.geocod.io/v1.2/geocode',
  geocodio_api_key: '5e63eccacbca23cc6b6ffefc58abaacce8ca535',

  /**
   * Finds latitude and longitude for a given physical address, and
   * provides them as arguments to the given callback function.
   * @param address Physical address to find coordinates for
   * @param callback Function to be called with the coordinates
   * @param context Scope in which to call the callback
   */
  findCoordinates: function (address, callback, context) {
    $.ajax({
      url: this.geocodio_api_url +
        '?api_key=' + this.geocodio_api_key +
        '&q=' + address,
      success: function(response){
        var location = response.results[0].location;
        callback.apply(context,[location.lat, location.lng]);
      },
      dataType: 'json'
    });
  }
};
