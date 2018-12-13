/* Rajita: 
    This object has two arrays, one for flights and one for hotels. Each array
    has a total length of 5 objects containing the data we want to display.
*/
var TEST_DATA = {
  from: "RDU",
  to: "LAX",
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

var chosenFlightPrice = 0;
var chosenHotelPrice = 0;

function updateTotalPrice() {
  $("#total-price").text("$" + (chosenHotelPrice + chosenFlightPrice));
}

function updateChosenFlight(id) {
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
});
