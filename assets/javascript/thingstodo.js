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

/*
function findThingsToDo(searchLocation) {
  var service = new google.maps.places.PlacesService(map);

  //find point of interest
  service.nearbySearch(
    {
      location: searchLocation,
      radius: 20000,
      type: ["point_of_interest"],
      keyword: ["things to do", "park", "lake", "museum"],
      rankBy: google.maps.places.RankBy.PROMINENCE
    },
    callbackThingstoDo
  );
}*/
/*
function callbackThingstoDo(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var thingstodoObj = results[i];
      console.log(results[i]);
      console.log(thingstodoObj.photos[0].html_attributions[0]);
      var newRow = $("<tr>");
      newRow
        .addClass("thingstodo-row")
        .attr("id", i)
        .append("<td>" + thingstodoObj.name + "</td>")
        .append("<td>" + thingstodoObj.rating + "</td>")
        .append("<td>" + thingstodoObj.vicinity + "</td>")
        .append(
          "<td>" + thingstodoObj.photos[0].html_attributions[0] + "</td>"
        );
      $("#thingstodo-table").append(newRow);
    }
  }
}
*/

$(document).ready(function() {
  //TEMP changes to populate things to do
  results = TEST_DATA_TTD.thingstodo;
  for (var i = 0; i < results.length; i++) {
    var thingstodoObj = results[i];
    console.log(results[i]);
    console.log(thingstodoObj.photos[0].html_attributions[0]);
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

  // Rajita changes
  //commented to make it work on page load for now. needs to be revised
  /*
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

      //lat and lng of the city

      //copied from above
      var zoomLocation = results[0].geometry.location;
      var map = new google.maps.Map();

      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);

      //find point of interest
      service.nearbySearch(
        {
          location: zoomLocation,
          radius: 20000,
          type: ["point_of_interest"],
          keyword: ["things to do", "park", "lake", "museum"],
          rankBy: google.maps.places.RankBy.PROMINENCE
        },
        callbackThingstoDo
      );
    });
  });
  */
});
