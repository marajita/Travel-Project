var map;
var infowindow;

function initMap() {
  var raleigh = { lat: 0, lng: 0 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: raleigh,
    zoom: 2
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
    },
    {
      price: 500,
      airline: "United",
      departureTime: "12:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 1500,
      airline: "Frontier",
      departureTime: "11:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 550,
      airline: "JetBlue",
      departureTime: "04:34 PM",
      layovers: "Non-stop"
    },
    {
      price: 560,
      airline: "Delta",
      departureTime: "06:34 PM",
      layovers: "Charlotte"
    }
  ],
  hotels: [
    {
      price: 100,
      hotel: "Motel 6",
      stars: "2-star",
      beds: "1 queen bed"
    },
    {
      price: 110,
      hotel: "Holiday Inn",
      stars: "4-star",
      beds: "2 queen beds"
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
  var flightData = TEST_DATA.flights;
  for (var i = 0; i < flightData.length; i++) {
    var newRow = $("<tr>");
    newRow.append("<td>" + flightData[i].airline + "</td>");
    $("#flight").append(newRow);
    newRow.append("<td>" + flightData[i].price + "</td>");
    $("#flight").append(newRow);
    newRow.append("<td>" + flightData[i].departureTime + "</td>");
    $("#flight").append(newRow);
    newRow.append("<td>" + flightData[i].layovers + "</td>");
    $("#flight").append(newRow);
  }

  var hotelData = TEST_DATA.hotels;
  for (var i = 0; i < hotelData.length; i++) {
    var newRow = $("<tr>");
    newRow.append("<td>" + hotelData[i].hotel + "</td>");
    $("#hotels").append(newRow);
    newRow.append("<td>" + hotelData[i].price + "</td>");
    $("#hotels").append(newRow);
    newRow.append("<td>" + hotelData[i].stars + "</td>");
    $("#hotels").append(newRow);
    newRow.append("<td>" + hotelData[i].beds + "</td>");
    $("#hotels").append(newRow);
  }
});
