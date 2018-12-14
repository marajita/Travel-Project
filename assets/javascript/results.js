// // Initialize Firebase
// var config = {
//   apiKey: "AIzaSyC3Bnvip6bvt2gN9kUa2FOiRvSaYfIisyk",
//   authDomain: "my-first-project-dca58.firebaseapp.com",
//   databaseURL: "https://my-first-project-dca58.firebaseio.com",
//   projectId: "my-first-project-dca58",
//   storageBucket: "my-first-project-dca58.appspot.com",
//   messagingSenderId: "197544299923"
// };
// firebase.initializeApp(config);

// // Create a variable to reference the database
// var database = firebase.database();

var TEST_DATA = {
  from: "RDU",
  to: "LAX",
  chosenFlightId: 0,
  chosenHotelId: 0,
  flights: [
    {
      airline: "American Airlines",
      price: 200,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    {
      airline: "United Airlines",
      price: 300,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    {
      airline: "Delta Airlines",
      price: 450,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    {
      airline: "American Airlines",
      price: 610,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    {
      airline: "Southwest",
      price: 630,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    }
  ],
  hotels: [
    {
      hotel: "Motel 6",
      price: 210,
      stars: 2,
      beds: "1 queen bed"
    },
    {
      hotel: "Sheritan",
      price: 340,
      stars: 3,
      beds: "1 queen bed"
    },
    {
      hotel: "Days Inn",
      price: 360,
      stars: 3,
      beds: "1 queen bed"
    },
    {
      hotel: "Rodeway Inn",
      price: 400,
      stars: 4,
      beds: "1 queen bed"
    },
    {
      hotel: "Motel 6",
      price: 700,
      stars: 5,
      beds: "1 queen bed"
    }
  ]
};
var TEST_DATA_TTD = {
  thingstodo: [
    {
      rating: 4.7,
      name: "Bass Lake Park",
      vicinity: "900 Bass Lake Rd, Holly Springs",
      photos: [
        {
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/103953167144745303486/photos">vicki g</a>'
          ]
        }
      ]
    },
    {
      rating: 4.5,
      name: "North Carolina: Museum of Natural Sciences",
      vicinity: "Park Avenue",
      photos: [
        {
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/118436893859587628171/photos">North Carolina: Museum of Natural Sciences</a>'
          ]
        }
      ]
    },
    {
      rating: 4.9,
      name: "Redhat Amphitheater",
      vicinity: "100 Downtown Ave",
      photos: [
        {
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/108638231834824896585/photos">Zee Cyphor</a>'
          ]
        }
      ]
    },
    {
      rating: 4.3,
      name: "Jordan Lake",
      vicinity: "1000 Jorden Dr",
      photos: [
        {
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/103674796616436086310/photos">Artspace</a>'
          ]
        }
      ]
    }
  ]
};

var TEST_FAVORITES = [];

var chosenFlightPrice = 0;
var chosenHotelPrice = 0;

function updateTotalPrice() {
  $("#total-price").text("$" + (chosenHotelPrice + chosenFlightPrice));
}

function updateChosenFlight(id) {
  TEST_DATA.chosenFlightId = id;
  $("#current-flight").empty();
  $("#flight-price").text("$" + TEST_DATA.flights[id].price);
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + TEST_DATA.flights[id].airline + "</th>")
    .append(
      "<th class='chosen-th'>" + TEST_DATA.flights[id].departureTime + "</th>"
    )
    .append(
      "<th class='chosen-th'>" + TEST_DATA.flights[id].layovers + "</th>"
    );
  $("#current-flight").append(newRow);
  chosenFlightPrice = TEST_DATA.flights[id].price;
  updateTotalPrice();
}

function updateChosenHotel(id) {
  TEST_DATA.chosenHotelId = id;
  $("#current-hotel").empty();
  $("#hotel-price").text("$" + TEST_DATA.hotels[id].price);
  var totalStars = "";
  for (var i = 0; i < TEST_DATA.hotels[id].stars; i++) {
    totalStars += "<i class='icon star inverted'></i>";
  }
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + TEST_DATA.hotels[id].hotel + "</th>")
    .append("<th class='chosen-th'>" + totalStars + "</th>")
    .append("<th class='chosen-th'>" + TEST_DATA.hotels[id].beds + "</th>");
  $("#current-hotel").append(newRow);
  chosenHotelPrice = TEST_DATA.hotels[id].price;
  updateTotalPrice();
}

function updateData() {
  updateChosenFlight(0);
  updateChosenHotel(0);

  for (var i = 0; i < TEST_DATA.flights.length; i++) {
    var newRow = $("<tr>");
    newRow
      .addClass("flight-row")
      .attr("id", i)
      .append("<td>" + TEST_DATA.flights[i].airline + "</td>")
      .append("<td>" + TEST_DATA.flights[i].price + "</td>")
      .append("<td>" + TEST_DATA.flights[i].departureTime + "</td>")
      .append("<td>" + TEST_DATA.flights[i].layovers + "</td>");
    $("#flight-table").append(newRow);
  }

  for (var i = 0; i < TEST_DATA.hotels.length; i++) {
    var newRow = $("<tr>");
    var totalStars = "";
    for (var j = 0; j < TEST_DATA.hotels[i].stars; j++) {
      totalStars += "<i class='icon star inverted'></i>";
    }
    newRow
      .addClass("hotel-row")
      .attr("id", i)
      .append("<td>" + TEST_DATA.hotels[i].hotel + "</td>")
      .append("<td>" + TEST_DATA.hotels[i].price + "</td>")
      .append("<td>" + totalStars + "</td>")
      .append("<td>" + TEST_DATA.hotels[i].beds + "</td>");
    $("#hotel-table").append(newRow);
  }

  results = TEST_DATA_TTD.thingstodo;
  for (var i = 0; i < results.length; i++) {
    var thingstodoObj = results[i];
    var newRow = $("<tr>");
    newRow
      .addClass("thingstodo-row")
      .attr("id", i)
      .append("<td>" + thingstodoObj.name + "</td>")
      .append("<td>" + thingstodoObj.rating + "</td>")
      .append("<td>" + thingstodoObj.vicinity + "</td>")
      .append("<td>" + thingstodoObj.photos[0].html_attributions[0] + "</td>");
    $("#thingstodo-table").append(newRow);
  }
}

$(document).ready(function() {
  // TEST_DATA = JSON.parse(localStorage.getItem("DATA"));
  $("#top-text").text(
    "Round-trip from " +
      TEST_DATA.from +
      " to " +
      TEST_DATA.to +
      ", for four nights"
  );
  updateData();

  $(".flight-row").on("click", function() {
    updateChosenFlight($(this).attr("id"));
  });
  $(".hotel-row").on("click", function() {
    updateChosenHotel($(this).attr("id"));
  });

  $("#add-saved").on("click", function() {
    TEST_FAVORITES.push({
      from: TEST_DATA.from,
      to: TEST_DATA.to,
      flight: TEST_DATA.flights[TEST_DATA.chosenFlightId],
      hotel: TEST_DATA.hotels[TEST_DATA.chosenHotelId]
    });

    var user = firebase.auth().currentUser;
    var favorites = TEST_FAVORITES;
    database.ref("user/" + user.uid).update({
      Email: currentUserEmail,
      Favorites: favorites
    });
  });
});
