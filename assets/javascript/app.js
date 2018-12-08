var map;
var infowindow;

var posLatitude;
var posLongitude;

/*
navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
  console.log(position);
  posLatitude = position.coords.latitude;
  posLongitude = position.coords.longitude;
  console.log(posLatitude);
  //console.log(posLongitude);
}
*/

//Adds one month
function addOneMonth() {
  return moment()
    .add(1, "months")
    .format("YYYY-MM-DD");
}
var oneMonth = addOneMonth();
console.log(oneMonth);

//Gets the latitude and longitude of user's location once the current position is located
var getLocation = new Promise(function(resolve, reject) {
  function showPosition(position) {
    resolve(position);
  }
  navigator.geolocation.getCurrentPosition(showPosition);
});

getLocation.then(function(position) {
  posLatitude = position.coords.latitude;
  posLongitude = position.coords.longitude;
  console.log(position);
  console.log(posLatitude);
  console.log(posLongitude);
});

//JSON object for map
var style = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121"
      }
    ]
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121"
      }
    ]
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a"
      }
    ]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c"
      }
    ]
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e"
      }
    ]
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161"
      }
    ]
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d"
      }
    ]
  }
];

function initMap() {
  var raleigh = { lat: 0, lng: 0 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: raleigh,
    zoom: 2,
    styles: style
  });

  map.addListener("click", function(event) {
    map.setZoom(5);
    map.panTo({ lat: event.latLng.lat(), lng: event.latLng.lng() });

    // AJAX CALL CHAIN TRIGGERED HERE, DO NOT UNCOMMENT
    // #region DO_NOT_UNCOMMENT
    // $.ajax({
    //   url: "https://test.api.amadeus.com/v1/security/oauth2/token",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: "POST",
    //   dataType: "json",
    //   data: {
    //     grant_type: "client_credentials",
    //     client_id: "2TqxmYIjBHdCQixlwlgBMpnD2uCA4IPi",
    //     client_secret: "oabpCuBYyfpcRGsa"
    //   },
    //   success: function(response) {
    //     var accessToken = response.access_token;

    //     findNearestAirports(
    //       event.latLng.lat(),
    //       event.latLng.lng(),
    //       accessToken
    //     );
    //   },
    //   error: function() {
    //     alert("error");
    //   }
    // });
    // #endregion

    console.log(
      "Latitude: " +
        event.latLng.lat() +
        " " +
        ", longitude: " +
        event.latLng.lng()
    );
  });
}

function findNearestAirports(lat, lng, accessToken) {
  var queryURL =
    "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=" +
    +lat +
    "&longitude=" +
    lng +
    "&page[limit]=4";
  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    var airports = response.data;
    var airportCodeArray = [];
    for (var i = 0; i < airports.length; i++) {
      var obj = {
        airportCode: airports[i].iataCode,
        cityCode: airports[i].address.cityCode
      };
      airportCodeArray.push(obj);
    }
    var departureDate = "2019-01-07"; // YYYY-MM-DD
    var returnDate = "2019-01-12";
    findFlights(airportCodeArray, accessToken, departureDate, returnDate);
    findHotels(airportCodeArray, accessToken, departureDate, returnDate);
  });
}

function findFlights(airports, accessToken, departureDate, returnDate) {
  var origin = "RDU";
  var destination = airports[0].airportCode;

  var max = 5;
  var queryURL =
    "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=" +
    origin +
    "&destination=" +
    destination +
    "&departureDate=" +
    departureDate +
    "&returnDate=" +
    returnDate +
    "&max=" +
    max +
    "&currency=USD";

  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
}

function findHotels(airports, accessToken, departureDate, returnDate) {
  var cityCode = airports[0].cityCode;
  var queryURL =
    "https://test.api.amadeus.com/v1/shopping/hotel-offers?cityCode=" +
    cityCode +
    "&checkInDate=" +
    departureDate +
    "&checkOutDate=" +
    returnDate +
    "&radius=15";

  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
}

function callback(results, status) {
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

var TEST_DATA = {
  flights: [
    {
      price: 200,
      airline: "American Airlines",
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    }
  ],
  hotels: [
    {
      price: 100,
      hotel: "Motel 6",
      stars: "2-star",
      beds: "1 queen bed"
    }
  ]
};

$(document).ready(function() {
  // Rajita changes
  $("#search").on("click", function() {
    var city = $("#searchField").val();
    console.log(city);
    var queryURL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      city +
      "&key=AIzaSyAtkZKjttye0ywNE5_lGpE2VG-4_X7FLGE";
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var results = response.results;
      console.log(results);
      console.log(results[0].geometry.location);

      $("#results").empty();
      //lat and lng of the city

      //copied from above
      var zoomLocation = results[0].geometry.location;
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

  // Rajita changes
  $("#search").on("click", function() {
    var city = $("#searchField").val();
    console.log(city);
    var queryURL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      city +
      "&key=AIzaSyAtkZKjttye0ywNE5_lGpE2VG-4_X7FLGE";
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var results = response.results;
      console.log(results);
      console.log(results[0].geometry.location);

      $("#results").empty();
      //lat and lng of the city

      //copied from above
      var zoomLocation = results[0].geometry.location;
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
});
