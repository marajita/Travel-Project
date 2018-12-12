// Initialize Firebase
var config = {
  apiKey: "AIzaSyC3Bnvip6bvt2gN9kUa2FOiRvSaYfIisyk",
  authDomain: "my-first-project-dca58.firebaseapp.com",
  databaseURL: "https://my-first-project-dca58.firebaseio.com",
  projectId: "my-first-project-dca58",
  storageBucket: "my-first-project-dca58.appspot.com",
  messagingSenderId: "197544299923"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

const auth = firebase.auth;
const emailAuth = new auth.EmailAuthProvider();

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

    findNearestAirports(event.latLng.lat(), event.latLng.lng());
  });
}

function getAccessToken() {
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
      console.log(response.expires_in);
      accessToken = response.access_token;
      // findStartAirport(posLatitude, posLongitude);
    },
    error: function() {
      alert("Error with getting access token");
    }
  });
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
    origin = response.data[0].iataCode;
    $("#from-input").val(origin);
    updateLocations(response.data[0].iataCode);
  });
}

function setDestination(lat, long) {
  $(".ui-segment").show();
  // AJAX CALL CHAIN TRIGGERED HERE, DO NOT UNCOMMENT
  // #region DO_NOT_UNCOMMENT
  // findNearestAirports(lat, long);
  // #endregion
}

function findNearestAirports(lat, lng) {
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
    airportCode = airports[0].iataCode;
    cityCode = airports[0].address.cityCode;
    $("#searchField").val(airportCode);
    updateLocations(airportCode);
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
            .departure.at,
        layovers: flights[i].offerItems[0].services[0].segments.length
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
    "&radius=50";

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
        hotel: hotels[i].hotel.name,
        price: Math.round(hotels[i].offers[0].price.total),
        stars: hotels[i].hotel.rating,
        beds: hotels[i].offers[0].room.type
      });
    }
    console.log(response);
    updateData();
  });
}

function updateData() {
  dataRetrieved++;

  if (dataRetrieved === 2) {
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
    // $(".ui-segment").show();
    // findFlights(airportCode, oneMonth, oneMonthFourDays);
    // findHotels(cityCode, oneMonth, oneMonthFourDays);
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

var TEST_DATA = {
  flights: [
    {
      airline: "American Airlines",
      price: 200,
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
      hotel: "Motel 6",
      price: 100,
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

var DISPLAY_DATA = {
  flights: [],
  hotels: []
};

$(document).ready(function() {
  $("#btnLogIn").on("click", function() {
    var userEmail = $("#txtEmail").val();
    var userPassword = $("#txtPassword").val();
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
      });
    const promise = auth.signInWithNameAndPassword(userEmail, userPassword);
    promise.catch(e => console.log(e.message));
  });

  $("#btnLogOut").on("click", function() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });
  });

  $("#btnSignUp").on("click", function() {
    var userEmail = $("#txtEmail").val();
    var userPassword = $("#txtPassword").val();
    firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(error.Message);
        console.log("Something Went Wrong");
        // ...
      });
    /*
    const promise = auth.createUserWithNameAndPassword(userEmail, userPassword);
    promise.catch(e => console.log(e.message));
    */
  });

  $(".ui-segment").hide();

  $("#close-warning").on("click", function() {
    $(".warning-msg").hide();
  });

  $("#location-services").on("click", function() {
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
    var fromInput = $("#from-input")
      .val()
      .trim();
    // $("#from-input").val(city);
    var city = $("#searchField")
      .val()
      .trim();
    $("#searchField").val(city);

    if (city === "") {
      $("#searchField").addClass("input-missing");
    } else {
      findLocOnSearch(city, false);
    }
    if (fromInput === "") {
      $("#from-input").addClass("input-missing");
    } else {
      findLocOnSearch(fromInput, true);
    }

    // if (city != null || city != "") {
    //   var queryURL =
    //     "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    //     city +
    //     "&key=AIzaSyAtkZKjttye0ywNE5_lGpE2VG-4_X7FLGE";
    //   $.ajax({
    //     url: queryURL,
    //     method: "GET"
    //   }).then(function(response) {
    //     var results = response.results;

    //     var zoomLocation = results[0].geometry.location;
    //     map.setZoom(5);
    //     map.panTo(zoomLocation);
    //     setDestination(zoomLocation.lat, zoomLocation.lng);
    //   });
    // }
  });
  getAccessToken();
});
