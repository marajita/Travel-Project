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

$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user != null) {
      $("#current-user").text(user.email);
      $("#logged-out").hide();
      $("#logged-in").show();
    }
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
    var user = firebase.auth().currentUser;
    database.ref("user/" + user.uid).once("value", function(snapshot) {
      console.log(JSON.parse(snapshot.val().saved));
    });
  });

  $("#add-saved").on("click", function() {
    TEST_FAVORITES.push({
      from: TEST_DATA.from,
      to: TEST_DATA.to,
      flight: TEST_DATA.flights[TEST_DATA.chosenFlightId],
      hotel: TEST_DATA.hotels[TEST_DATA.chosenHotelId]
    });

    var user = firebase.auth().currentUser;
    var saved = JSON.stringify(TEST_FAVORITES);
    database.ref("user/" + user.uid + "/saved").set(saved);
  });
});
