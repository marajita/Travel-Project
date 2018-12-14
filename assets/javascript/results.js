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

var DISPLAY_DATA = [];
var chosenFlightPrice = 0;
var chosenHotelPrice = 0;

function updateTotalPrice() {
  $("#total-price").text("$" + (chosenHotelPrice + chosenFlightPrice));
}

function updateChosenFlight(id) {
  DISPLAY_DATA.chosenFlightId = id;
  $("#current-flight").empty();
  $("#flight-price").text("$" + DISPLAY_DATA.flights[id].price);
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append(
      "<th class='chosen-th'>" + DISPLAY_DATA.flights[id].airline + "</th>"
    )
    .append(
      "<th class='chosen-th'>" +
        DISPLAY_DATA.flights[id].departureTime +
        "</th>"
    );
  $("#current-flight").append(newRow);
  chosenFlightPrice = DISPLAY_DATA.flights[id].price;
  updateTotalPrice();
}

function updateChosenHotel(id) {
  DISPLAY_DATA.chosenHotelId = id;
  $("#current-hotel").empty();
  $("#hotel-price").text("$" + DISPLAY_DATA.hotels[id].price);
  var totalStars = "";
  for (var i = 0; i < DISPLAY_DATA.hotels[id].stars; i++) {
    totalStars += "<i class='icon star inverted'></i>";
  }
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + DISPLAY_DATA.hotels[id].hotel + "</th>")
    .append("<th class='chosen-th'>" + totalStars + "</th>");
  $("#current-hotel").append(newRow);
  chosenHotelPrice = DISPLAY_DATA.hotels[id].price;
  updateTotalPrice();
}

function updateData() {
  updateChosenFlight(0);
  updateChosenHotel(0);

  for (var i = 0; i < DISPLAY_DATA.flights.length; i++) {
    var newRow = $("<tr>");
    newRow
      .addClass("flight-row")
      .attr("id", i)
      .append("<td>" + DISPLAY_DATA.flights[i].airline + "</td>")
      .append("<td>$" + DISPLAY_DATA.flights[i].price + "</td>")
      .append("<td>" + DISPLAY_DATA.flights[i].departureTime + "</td>");
    if (i % 2 === 0) {
      newRow.addClass("light-row");
    }
    $("#flight-table").append(newRow);
  }

  for (var i = 0; i < DISPLAY_DATA.hotels.length; i++) {
    var newRow = $("<tr>");
    var totalStars = "";
    for (var j = 0; j < DISPLAY_DATA.hotels[i].stars; j++) {
      totalStars += "<i class='icon star inverted'></i>";
    }
    newRow
      .addClass("hotel-row")
      .attr("id", i)
      .append("<td>" + DISPLAY_DATA.hotels[i].hotel + "</td>")
      .append("<td>$" + DISPLAY_DATA.hotels[i].price + "</td>")
      .append("<td>" + totalStars + "</td>");
    if (i % 2 === 0) {
      newRow.addClass("light-row");
    }
    $("#hotel-table").append(newRow);
  }

  results = DISPLAY_DATA.attractions;
  for (var i = 0; i < results.length; i++) {
    var thingstodoObj = results[i];
    var newRow = $("<tr>");
    newRow
      .addClass("thingstodo-row")
      .attr("id", i)
      .append("<td>" + thingstodoObj.name + "</td>")
      .append("<td>" + thingstodoObj.rating + "</td>")
      .append("<td>" + thingstodoObj.vicinity + "</td>");
    // .append("<td>" + thingstodoObj.photos[0].html_attributions[0] + "</td>");
    if (i % 2 === 0) {
      newRow.addClass("light-row");
    }
    $("#thingstodo-table").append(newRow);
  }
}

$(document).ready(function() {
  DISPLAY_DATA = JSON.parse(localStorage.getItem("DATA"));
  $("#top-text").text(
    "Round-trip from " +
      DISPLAY_DATA.from +
      " to " +
      DISPLAY_DATA.to +
      ", for four nights"
  );
  updateData();

  $(".flight-row").on("click", function() {
    updateChosenFlight($(this).attr("id"));
  });
  $(".hotel-row").on("click", function() {
    updateChosenHotel($(this).attr("id"));
  });

  // $("#add-saved").on("click", function() {
  //   TEST_FAVORITES.push({
  //     from: TEST_DATA.from,
  //     to: TEST_DATA.to,
  //     flight: TEST_DATA.flights[TEST_DATA.chosenFlightId],
  //     hotel: TEST_DATA.hotels[TEST_DATA.chosenHotelId]
  //   });

  //   var user = firebase.auth().currentUser;
  //   var favorites = TEST_FAVORITES;
  //   database.ref("user/" + user.uid).update({
  //     Email: currentUserEmail,
  //     Favorites: favorites
  //   });
  // });
});
