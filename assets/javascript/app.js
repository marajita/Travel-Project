var latitude = 0;
var longitude = 0;
var numResults = 8;
var map;
var infowindow;

function initMap() {
  var raleigh = { lat: latitude, lng: longitude };

  map = new google.maps.Map(document.getElementById("map"), {
    center: raleigh,
    zoom: 2
  });
}

function callback(results, status) {
  var lodingIdArray = [];
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      console.log(results[i]);
      $("#results").append(
        "<div>" + results[i].name + ", Price level: " + results[i].price_level
      );
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
$(document).ready(function() {
  $("#raleigh-btn").on("click", function() {
    $("#results").empty();
    latitude = 35.779432;
    longitude = -78.639434;
    var zoomLocation = { lat: latitude, lng: longitude };

    map.setZoom(14);
    map.panTo(zoomLocation);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: zoomLocation,
        radius: 500,
        type: ["lodging"]
      },
      callback
    );
  });

  $("#los-angeles-btn").on("click", function() {
    $("#results").empty();
    latitude = 34.052298;
    longitude = -118.24517;
    var zoomLocation = { lat: latitude, lng: longitude };

    map.setZoom(14);
    map.panTo(zoomLocation);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: zoomLocation,
        radius: 500,
        type: ["lodging"]
      },
      callback
    );
  });

  $("#new-york-btn").on("click", function() {
    $("#results").empty();
    latitude = 40.71414;
    longitude = -74.006261;
    var zoomLocation = { lat: latitude, lng: longitude };

    map.setZoom(14);
    map.panTo(zoomLocation);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: zoomLocation,
        radius: 500,
        type: ["lodging"]
      },
      callback
    );
  });
});
