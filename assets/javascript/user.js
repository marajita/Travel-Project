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
var user;
var totalPrice = 0;
var SAVED_DATA = [];

const auth = firebase.auth;
const emailAuth = new auth.EmailAuthProvider();
var provider = new firebase.auth.GoogleAuthProvider();

function hideUserModal() {
  $(".signupPopup").modal("hide");
  $("#txtEmail").val("");
  $("#txtPassword").val("");
}

function checkUserModalInputs() {
  $("#email-tooltip").hide();
  var email = $("#txtEmail")
    .val()
    .trim();
  var password = $("#txtPassword")
    .val()
    .trim();

  if (email === "") {
    $("#txtEmail").addClass("input-missing");
  }
  if (password === "") {
    $("#txtPassword").addClass("input-missing");
  }
}

function updateSavedData() {
  $("#saved-table").empty();
  var newHeadRow = $("<tr>");
  newHeadRow
    .append('<th style="width: 30px">Remove</th>')
    .append("<th>From</th>")
    .append("<th>To</th>")
    .append("<th>Total Cost</th>")
    .append("<th>Airline</th>")
    .append("<th>Hotel</th>");
  $("#saved-table").append(newHeadRow);
  for (var i = 0; i < SAVED_DATA.length; i++) {
    var newRow = $("<tr>");
    var totalCost = SAVED_DATA[i].flight.price + SAVED_DATA[i].hotel.price;
    newRow
      .addClass("saved-row")
      .attr("data-id", i)
      .append(
        "<button class='ui icon button blue remove-saved' data-id='" +
          i +
          "' style='font-size: 16px'><i class='close icon'></i></button>"
      )
      .append("<td>" + SAVED_DATA[i].from + "</td>")
      .append("<td>" + SAVED_DATA[i].to + "</td>")
      .append("<td>" + totalCost + "</td>")
      .append("<td>" + SAVED_DATA[i].flight.airline + "</td>")
      .append("<td>" + SAVED_DATA[i].hotel.hotel + "</td>");
    $("#saved-table").append(newRow);
    if (i % 2 === 0) {
      newRow.addClass("light-row");
    }
  }
}

function updateFlight(id) {
  $("#current-flight").empty();
  $("#flight-price").text("$" + SAVED_DATA[id].flight.price);
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + SAVED_DATA[id].flight.airline + "</th>")
    .append(
      "<th class='chosen-th'>" + SAVED_DATA[id].flight.departureTime + "</th>"
    );
  $("#current-flight").append(newRow);
}

function updateHotel(id) {
  $("#current-hotel").empty();
  $("#hotel-price").text("$" + SAVED_DATA[id].hotel.price);
  var totalStars = "";
  for (var i = 0; i < SAVED_DATA[id].hotel.stars; i++) {
    totalStars += "<i class='icon star inverted'></i>";
  }
  var newRow = $("<tr>");
  newRow
    .addClass("chosen-row")
    .append("<th class='chosen-th'>" + SAVED_DATA[id].hotel.hotel + "</th>")
    .append("<th class='chosen-th'>" + totalStars + "</th>");
  $("#current-hotel").append(newRow);
}

function updatePrice(id) {
  totalPrice = SAVED_DATA[id].hotel.price + SAVED_DATA[id].flight.price;
  $("#total-price").text("$" + totalPrice);
}

function initSaved() {
  var user = firebase.auth().currentUser;
  database.ref("user/" + user.uid).once("value", function(snapshot) {
    SAVED_DATA = JSON.parse(snapshot.val().saved);
    updateSavedData();
  });
}

$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user != null) {
      $("#current-user").text(user.email);
      $("#logged-out").hide();
      $("#logged-in").show();
      initSaved();
    }
  });

  $("table").on("click", ".saved-row", function() {
    totalPrice = 0;

    var id = $(this).attr("data-id");
    $("#top-text").text(
      "Round-trip from " +
        SAVED_DATA[id].from +
        " to " +
        SAVED_DATA[id].to +
        ", for four nights"
    );
    updateFlight(id);
    updateHotel(id);
    updatePrice(id);
  });

  $("table").on("click", ".remove-saved", function(e) {
    e.stopPropagation();
    SAVED_DATA.splice($(this).attr("data-id"), 1);
    var user = firebase.auth().currentUser;
    var saved = JSON.stringify(SAVED_DATA);
    database.ref("user/" + user.uid + "/saved").set(saved);
    updateSavedData();
  });

  $("#btn-show-modal").click(function() {
    $("#email-tooltip").hide();
    $(".signupPopup").modal("show");
    $("#txtEmail").removeClass("input-missing");
    $("#txtPassword").removeClass("input-missing");
  });
  $(".signupPopup").modal({
    closable: true
  });

  $("#btnLogIn").on("click", function(e) {
    e.preventDefault();
    checkUserModalInputs();
    var errorCode = "";
    var errorMessage = "";
    var userEmail = $("#txtEmail").val();
    var userPassword = $("#txtPassword").val();
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .catch(function(error) {
        // Handle Errors here.
        errorCode = error.code;
        errorMessage = error.message;
        $("#email-tooltip")
          .show()
          .attr("data-tooltip", errorMessage);
        console.log(errorCode);
        console.log(errorMessage);
        // ...
      })
      .then(function() {
        if (errorCode === "") {
          hideUserModal();
          user = firebase.auth().currentUser;
          $("#current-user").text(user.email);
          if (user != null) {
            $("#logged-out").hide();
            $("#logged-in").show();
            updateSavedData();
          }
        }
      });
  });

  $("#btnLogOut").on("click", function(e) {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        $("#logged-out").show();
        $("#logged-in").hide();
        $("#saved-table").empty();
      })
      .catch(function(error) {
        // An error happened.
        console.log(error.message);
      });
  });

  $("#btnSignUp").on("click", function(e) {
    e.preventDefault();
    checkUserModalInputs();
    var errorCode = "";
    var errorMessage = "";
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
        errorCode = error.code;
        errorMessage = error.message;
        $("#email-tooltip")
          .show()
          .attr("data-tooltip", errorMessage);
        console.log(errorCode);
        console.log(errorMessage);
      })
      .then(function() {
        if (errorCode === "") {
          hideUserModal();
          user = firebase.auth().currentUser;
          console.log(user);
          $("#current-user").text(user.email);
          if (user != null) {
            $("#logged-out").hide();
            $("#logged-in").show();
          }
        }
        //   /*
        //     const promise = auth.createUserWithNameAndPassword(userEmail, userPassword);
        //     promise.catch(e => console.log(e.message));
        //   */
      });
  });

  $("#btn-saved").on("click", function() {
    // LOAD SAVED.HTML HERE
    window.location.href = "saved.html";
  });

  $("#add-saved").on("click", function() {
    SAVED_DATA.push({
      from: DISPLAY_DATA.from,
      to: DISPLAY_DATA.to,
      flight: DISPLAY_DATA.flights[DISPLAY_DATA.chosenFlightId],
      hotel: DISPLAY_DATA.hotels[DISPLAY_DATA.chosenHotelId]
    });

    var user = firebase.auth().currentUser;
    var saved = JSON.stringify(SAVED_DATA);
    database.ref("user/" + user.uid + "/saved").set(saved);
  });
});
