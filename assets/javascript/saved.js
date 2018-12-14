var TEST_DATA = [
  {
    from: "RDU",
    to: "LAX",
    flight: {
      airline: "United Airlines",
      price: 300,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    hotel: {
      hotel: "Rodeway Inn",
      price: 400,
      stars: 2,
      beds: "1 queen bed"
    }
  },
  {
    from: "SEA",
    to: "BOS",
    flight: {
      airline: "JetBlue",
      price: 451,
      departureTime: "2:34 PM",
      layovers: "Non-stop"
    },
    hotel: {
      hotel: "Hilton Boston",
      price: 1105,
      stars: 4,
      beds: "1 queen bed"
    }
  }
];
var totalPrice = 0;

function updateData() {
  for (var i = 0; i < TEST_DATA.length; i++) {
    var newRow = $("<tr>");
    var totalCost = TEST_DATA[i].flight.price + TEST_DATA[i].hotel.price;
    newRow
      .addClass("flight-row")
      .attr("id", i)
      .append("<td>" + TEST_DATA[i].from + "</td>")
      .append("<td>" + TEST_DATA[i].to + "</td>")
      .append("<td>" + totalCost + "</td>")
      .append("<td>" + TEST_DATA[i].flight.airline + "</td>")
      .append("<td>" + TEST_DATA[i].hotel.hotel + "</td>");
    $("#saved-table").append(newRow);
  }
}

function updateChosenFlight(id) {
  $("#current-flight").empty();
  $("#flight-price").text("$" + TEST_DATA[id].flight.price);
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + TEST_DATA[id].flight.airline + "</th>")
    .append(
      "<th class='chosen-th'>" + TEST_DATA[id].flight.departureTime + "</th>"
    )
    .append("<th class='chosen-th'>" + TEST_DATA[id].flight.layovers + "</th>");
  $("#current-flight").append(newRow);
}

function updateChosenHotel(id) {
  $("#current-hotel").empty();
  $("#hotel-price").text("$" + TEST_DATA[id].hotel.price);
  var totalStars = "";
  for (var i = 0; i < TEST_DATA[id].hotel.stars; i++) {
    totalStars += "<i class='icon star inverted'></i>";
  }
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + TEST_DATA[id].hotel.hotel + "</th>")
    .append("<th class='chosen-th'>" + totalStars + "</th>")
    .append("<th class='chosen-th'>" + TEST_DATA[id].beds + "</th>");
  $("#current-hotel").append(newRow);
}

function updateTotalPrice(id) {
  totalPrice = TEST_DATA[id].hotel.price + TEST_DATA[id].flight.price;
  $("#total-price").text("$" + totalPrice);
}

$(document).ready(function() {
  updateData();
  $(".flight-row").on("click", function() {
    totalPrice = 0;

    var id = $(this).attr("id");
    $("#top-text").text(
      "Round-trip from " +
        TEST_DATA[id].from +
        " to " +
        TEST_DATA[id].to +
        ", for four nights"
    );
    updateChosenFlight(id);
    updateChosenHotel(id);
    updateTotalPrice(id);
  });
});
