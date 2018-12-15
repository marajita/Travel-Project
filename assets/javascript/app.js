var map;
var infowindow;
var posLatitude;
var posLongitude;
var origin = "";
var destination = "";
var dataRetrieved = 0;
var locationsRetrieved = 0;
var accessToken = "";
var airportCode = "";
var cityCode = "";
var todoLat;
var todoLng;
var user;

var DISPLAY_DATA = {
  from: "",
  to: "",
  chosenFlightId: 0,
  chosenHotelId: 0,
  flights: [],
  hotels: [],
  attractions: []
};

//JSON object for map (Alex)
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

var intervalID;
var timer = 0;
function increaseTimer() {
  timer++;
  if (timer >= 1798) {
    timer = 0;
    getAccessToken();
  }
}
function runTimer() {
  clearInterval(intervalID);
  intervalID = setInterval(increaseTimer, 1000);
}
function stopTimer() {
  clearInterval(intervalID);
}

function initMap() {
  var raleigh = { lat: 0, lng: 0 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: raleigh,
    zoom: 2,
    styles: style,
    disableDefaultUI: true
  });

  map.addListener("click", function(event) {
    map.setZoom(5);
    map.panTo({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    locationsRetrieved = 0;
    if (origin != "") {
      locationsRetrieved++;
    }
    findNearestAirports(event.latLng.lat(), event.latLng.lng());
  });
}

function getAccessToken() {
  stopTimer();
  $.ajax({
    url: "https://test.api.amadeus.com/v1/security/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    dataType: "json",
    data: {
      grant_type: "client_credentials",
      client_id: "2TqxmYIjBHdCQixlwlgBMpnD2uCA4IPi",
      client_secret: "oabpCuBYyfpcRGsa"
    },
    success: function(response) {
      accessToken = response.access_token;
    },
    error: function() {
      console.log("Error with getting access token");
    }
  });
  runTimer();
}

function findStartAirport(lat, lng) {
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
    if (response.data.length > 0) {
      origin = response.data[0].iataCode;
      $("#from-input").val(origin);
      DISPLAY_DATA.from = response.data[0].iataCode;
      updateLocations(response.data[0].iataCode);
    } else {
      console.log("FAIL ORIGIN AIRPORT");
      $("#from-tooltip")
        .show()
        .attr("data-tooltip", "No airport found near location!");
      $("#from-input").addClass("input-missing");
    }
  });
}

function findNearestAirports(lat, lng) {
  $("#to-tooltip").hide();
  $("#searchField").removeClass("input-missing");
  todoLat = lat;
  todoLng = lng;
  var queryURL =
    "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=" +
    lat +
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
    if (airports.length > 0) {
      airportCode = airports[0].iataCode;
      cityCode = airports[0].address.cityCode;
      $("#searchField").val(airportCode);
      DISPLAY_DATA.to = airportCode;
      updateLocations(airportCode);
    } else {
      console.log("FAIL DESTINATION AIRPORT");
      $("#to-tooltip")
        .show()
        .attr("data-tooltip", "No airport found near location!");
      $("#searchField").addClass("input-missing");
    }
  });
}

function findFlights(destination, departureDate, returnDate) {
  var max = 5;
  var queryURL =
    "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=" +
    origin +
    "&destination=" +
    airportCode +
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
    var flights = response.data;
    for (var i = 0; i < flights.length; i++) {
      DISPLAY_DATA.flights.push({
        airline:
          flights[i].offerItems[0].services[0].segments[0].flightSegment
            .carrierCode,
        price: Math.round(flights[i].offerItems[0].price.total),
        departureTime:
          flights[i].offerItems[0].services[0].segments[0].flightSegment
            .departure.at
      });
    }
    console.log(response);
    updateData();
  });
}

function findHotels(city, departureDate, returnDate) {
  var queryURL =
    "https://test.api.amadeus.com/v1/shopping/hotel-offers?cityCode=" +
    cityCode +
    "&checkInDate=" +
    departureDate +
    "&checkOutDate=" +
    returnDate +
    "&radius=100";

  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    var hotels = response.data;
    var hotelLength = 0;
    if (hotels.length > 5) {
      hotelLength = 5;
    } else {
      hotelLength = hotels.length;
    }
    for (var i = 0; i < hotelLength; i++) {
      DISPLAY_DATA.hotels.push({
        hotel: toPascalCase(hotels[i].hotel.name),
        price: Math.round(hotels[i].offers[0].price.total),
        stars: hotels[i].hotel.rating
      });
    }
    console.log(response);
    findThingsToDo();
    updateData();
  });
}

function findThingsToDo() {
  var search = new google.maps.LatLng(todoLat, todoLng);
  var service = new google.maps.places.PlacesService(map);
  var request = {
    location: search,
    radius: 50000,
    type: ["point_of_interest"],
    keyword: ["things to do", "park", "lake", "museum"],
    rankBy: google.maps.places.RankBy.PROMINENCE
  };
  service.nearbySearch(request, callbackThingstoDo);
}

function callbackThingstoDo(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
    var attractionsLength = results.length;
    if (attractionsLength > 5) {
      attractionsLength = 5;
    }
    for (var i = 0; i < attractionsLength; i++) {
      DISPLAY_DATA.attractions.push(results[i]);
    }
    updateData();
  }
}

function updateData() {
  dataRetrieved++;

  if (dataRetrieved === 3) {
    console.log("READY");
    localStorage.setItem("DATA", JSON.stringify(DISPLAY_DATA));
    $(".ui-segment").hide();

    window.location.href = "result.html";
  }
}

function updateLocations(location) {
  console.log(location);
  locationsRetrieved++;

  if (origin != "" && airportCode != "") {
    var oneMonth = moment()
      .add(1, "months")
      .format("YYYY-MM-DD");
    var oneMonthFourDays = moment()
      .add(1, "months")
      .add(4, "days")
      .format("YYYY-MM-DD");
    console.log("START AJAX CHAIN HERE");
    $(".ui-segment").show();
    findFlights(airportCode, oneMonth, oneMonthFourDays);
    findHotels(cityCode, oneMonth, oneMonthFourDays);
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

function findLocOnSearch(searchText, setOrigin) {
  var queryURL =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    searchText +
    "&key=AIzaSyAtkZKjttye0ywNE5_lGpE2VG-4_X7FLGE";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var results = response.results;
    var location = results[0].geometry.location;

    if (setOrigin) {
      findStartAirport(location.lat, location.lng);
    } else {
      findNearestAirports(location.lat, location.lng);
    }
  });
}

$(document).ready(function() {
  $(".ui-segment").hide();

  $("#location-services").on("click", function() {
    $("#from-tooltip").hide();
    $("#from-input").removeClass("input-missing");
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
      findStartAirport(posLatitude, posLongitude);
    });
  });

  $("input").on("click", function() {
    $(this).removeClass("input-missing");
  });

  $("#search").on("click", function() {
    locationsRetrieved = 0;
    $("#from-tooltip").hide();
    $("#to-tooltip").hide();
    var fromInput = $("#from-input")
      .val()
      .trim();
    // $("#from-input").val(city);
    var city = $("#searchField")
      .val()
      .trim();
    $("#searchField").val(city);

    if (city === "") {
      $("#to-tooltip")
        .show()
        .attr("data-tooltip", "Enter a destination.");
      $("#searchField").addClass("input-missing");
    } else {
      findLocOnSearch(city, false);
    }
    if (fromInput === "") {
      $("#from-tooltip")
        .show()
        .attr("data-tooltip", "Enter a departure location.");
      $("#from-input").addClass("input-missing");
    } else {
      findLocOnSearch(fromInput, true);
    }
    //console.log(convertAirlineCodeToName("F9"));
  });
  getAccessToken();
  $("#from-tooltip").hide();
  $("#to-tooltip").hide();
});

function toPascalCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

function convertAirlineCodeToName(airlineCode) {
  var airlineName;
  var queryURL =
    "https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=" +
    airlineCode;
  $.ajax({
    url: queryURL,
    headers: {
      Authorization: "Bearer " + accessToken
    },
    method: "GET"
  }).then(function(response) {
    var airline = response.data;
    console.log(airline.businessName);
    airlineName = airline.businessName;
  });
  return airlineName;
}
