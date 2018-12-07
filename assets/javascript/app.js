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
  $("#flights-test-btn").on("click", function() {
    var apiKey = "AuMRk7LAmJtD3j86vh4BqAO6tBcnjunT";
    var origin = "RDU";
    var destination = "LAX";
    var departureDate = "2018-12-25";
    var returnDate = "2018-12-28";
    var queryURL =
      "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=" +
      apiKey +
      "&origin=" +
      origin +
      "&destination=" +
      destination +
      "&departure_date=" +
      departureDate +
      "&return_date=" +
      returnDate +
      "&number_of_results=5";

    // TEST DATA
    var TEST_OBJECT = [
      {
        itineraries: [
          {
            outbound: {
              duration: "08:34"
            }
          }
        ],
        fare: {
          total_price: "305.21"
        }
      },
      {
        itineraries: [
          {
            outbound: {
              duration: "10:15"
            }
          }
        ],
        fare: {
          total_price: "280.89"
        }
      },
      {
        itineraries: [
          {
            outbound: {
              duration: "16:11"
            }
          }
        ],
        fare: {
          total_price: "240.05"
        }
      },
      {
        itineraries: [
          {
            outbound: {
              duration: "08:34"
            }
          }
        ],
        fare: {
          total_price: "305.21"
        }
      },
      {
        itineraries: [
          {
            outbound: {
              duration: "08:34"
            }
          }
        ],
        fare: {
          total_price: "305.21"
        }
      }
    ];
    for (var i = 0; i < TEST_OBJECT.length; i++) {
      var flightDiv = $("<div>");
      flightDiv
        .append("<div>Cost: " + TEST_OBJECT[i].fare.total_price)
        .append(
          "<div>Time: " + TEST_OBJECT[i].itineraries[0].outbound.duration
        );
      $("#results").append(flightDiv);
    }
    // AJAX CALL FLIGHT DATA, DO NOT UNCOMMENT UNTIL END OF PROJECT
    // $.ajax({
    //   url: queryURL,
    //   method: "GET"
    // }).then(function(response) {
    //   var flights = response.results;

    //   for (var i = 0; i < flights.length; i++) {
    //     var flightDiv = $("<div>");
    //     flightDiv
    //       .append("<div>Cost: " + flights[i].fare.total_price)
    //       .append("<div>Time: " + flights[i].itineraries[0].outbound.duration);
    //     $("#results").append(flightDiv);
    //   }
    // });
  });

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
