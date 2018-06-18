//firebase

var userZipCode = 0;
var allMovieTitlesArr = [];
var posterImage = "";
var allMyMovies = [];
var selectedDateItems = [];
var yelpResults = [];
var activityResults = [];
var sectionsVisable = ["#activity", "#movie", "#restaurant"];
var yelpAPIRun = "";
var movieAPIRun = "";
var activityAPIRun = "";
var randomNumber = 0;
var showRandoButton = false;
var restaurantSelected = false;
var activitySelected = false;
var movieSelected = false;
var signedInUser = "";
var activityTypeField = false;
var movieRadiusField = false;
var dateSelectionField = false;
var zipCodeSelectField = false;
var showRandoButton = false;
var activities = {
    outdoor: {
        1: "Batting Cages",
        2: "Rent a convertable for the day",
        3: "River Rafting",
        4: "State Fair or Carnival",
        5: "Drive-in Movie",
        6: "Geocaching",
        7: "Go Fishing",
        8: "Picnic",
        9: "Hit the Beach",
        10: "Outdoor Concert",
        11: "Cycling",
        12: "Driving Range",
        13: "Go for a Hike",
        14: "Horseback Riding",
        15: "Boatride"
    },
    indoor: {
        1: "Bowling",
        2: "Enjoy an Art Museum",
        3: "Find a Local Bar",
        4: "Video Game Tournament",
        5: "Build a Fire",
        6: "Cook a fancy meal",
        7: "Bake a cake",
        8: "Concert",
        9: "Boardgame",
        10: "Go to the arcade",
        11: "Wine and cheese night",
        12: "Shop at the nicest mall",
        13: "Rock Climbing",
        14: "Comedy Show",
        15: "Aquarium"
    },
    cheap: {
        1: "Picnic",
        2: "Hiking",
        3: "Hit the Beach",
        4: "Go Fishing",
        5: "Boardgame",
        6: "Bake a cake",
        7: "Happy Hour",
        8: "Do Yoga",
        9: "Make a bucketlist",
        10: "Netflix",
        11: "Go to the thrift store",
        12: "Make a fire",
        13: "Stargazing",
        14: "Bowling",
        15: "Movie Marathon"
    },
    fancy: {
        1: "Horseback Riding",
        2: "Boatride",
        3: "Rent a convertable for the day",
        4: "Make a fancy meal",
        5: "Skiing",
        6: "Hot air balloon ride",
        7: "Sky Diving",
        8: "Dinner for two",
        9: "Go to a concert",
        10: "Shop at the nicest mall",
        11: "Go for a weekend getaway",
        12: "Wine-tasting",
        13: "Go to the spa",
        14: "Take a dance class",
        15: "Hire a private chef"
    },
};




var config = {
    apiKey: "AIzaSyC1Vh8DGZDc3j6Sv7QT8bMtsko-uKCU63M",
    authDomain: "make-a-date-58d62.firebaseapp.com",
    databaseURL: "https://make-a-date-58d62.firebaseio.com",
    projectId: "make-a-date-58d62",
    storageBucket: "make-a-date-58d62.appspot.com",
    messagingSenderId: "935239127539"
};
firebase.initializeApp(config);

var dataRef = firebase.database();
/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            // console.log(error);

            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        // console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        // console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        // [START_EXCLUDE silent]
        //document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            signedInUser = user.uid
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            document.getElementById('quickstart-sign-in2').textContent = 'Sign out';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                //document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            document.getElementById('quickstart-sign-in2').textContent = 'Sign in';
            document.getElementById('quickstart-account-details').textContent = 'null';
            signedInUser = ""
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    //document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    //document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}
// window.onload = function () {
//     initApp();
// };
//end firebase

$(document).ready(function () {

    var elem = document.querySelector('.collapsible.expandable');
    var instance = M.Collapsible.init(elem, {
        accordion: false
    });


    $('select').formSelect();


    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
        autoClose: true,
        format: "yyyy-mm-dd"
    });

    randomButtonShowHide()




});

//$("#searchButton").disabled = true;
$("#datepicker").change(function () {

    dateSelectionField = true;
    // console.log(dateSelectionField);

    searchBtnFunction();




    // if (movieRadiusField == true && activityTypeField == true && dateSelectionField == true && zipCodeSelectField == true) {
    //     // function enableBtn() {
    //     $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
    //     $("#searchButton").removeClass('disabled')
    // }

});

$("#user-zip").change(function () {

    if ($("#user-zip").val() == "") {
        zipCodeSelectField = false;
    } else {
        zipCodeSelectField = true;
        // console.log(zipCodeSelectField);
    }
    searchBtnFunction();

    // if (movieRadiusField == true && activityTypeField == true && dateSelectionField == true && zipCodeSelectField == true) {
    //     // function enableBtn() {
    //     $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
    //     $("#searchButton").removeClass('disabled')
    // }

});



$("#movie-radius").change(function () {

    if ($("#movie-radius").val() == "") {
        movieRadiusField = false;
    } else {
        movieRadiusField = true;
        // console.log(movieRadiusField);
    }


    searchBtnFunction();


    // $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
    // console.log("hello")
    // if (movieRadiusField == true && activityTypeField == true && dateSelectionField == true && zipCodeSelectField == true) {
    //     // function enableBtn() {
    //     $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
    //     $("#searchButton").removeClass('disabled')
    // }
});

$("#activity-type").change(function () {

    if ($("#activity-type").val() == "") {
        activityTypeField = false;
    } else {
        activityTypeField = true;
        // console.log(activityTypeField);
    }

    searchBtnFunction();


    // $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
    // console.log("hello")
    // if (movieRadiusField == true && activityTypeField == true && dateSelectionField == true && zipCodeSelectField == true) {
    //     // function enableBtn() {
    //     $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
    //     $("#searchButton").removeClass('disabled')
    // }

});


function searchBtnFunction() {

    // add in the date and zipcode to check if everything is filled out. Maybe change the check button into a function for shorter code


    if (movieRadiusField == true && activityTypeField == true && dateSelectionField == true && zipCodeSelectField == true) {
        // function enableBtn() {
        $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5")
        $("#searchButton").removeClass('disabled')
    } else {
        $("#searchButton").attr("class", "btn waves-effect waves-red z-depth-5 disabled")
    }

};

function activityFunction(activityType) {
    activityType = $("#activity-type").val();
    // var obj = { "act": activityType }
    // console.log(obj.activityType)

    // activtyTypeObject = JSON.stringify(obj);
    // console.log(activities[activityType])
    activityResults = activities[activityType]


    // console.log(activtyTypeObject);
    // console.log(activityTypeObject["act"]);
    // console.log(activities.activityTypeObject)
    $("#activity-body").empty();
    var n = 0;

    while (n < 15) {
        n++;
        // console.log(activities[activityType][n])
        createCard("activity", "", "", activities[activityType][n], n, activities[activityType][n].replace(/\s/g, ''));


    }
    activityAPIRun = "#activity"
    randomButtonShowHide()

}



//tmsapi movie api
function newMovieAPI() {
    //http://data.tmsapi.com/v1.1/movies/showings?startDate=2018-06-10&zip=84094&radius=20&units=mi&imageSize=Sm&imageText=true&api_key=prqret794d2txbvwk62p3jsv
    var apiKey = "prqret794d2txbvwk62p3jsv";
    var zipCode = $("#user-zip").val().trim();
    var radius = $("#movie-radius").val();
    var startDate = $("#datepicker").val(); //"2018-06-11"
    var movieRating = $("#movie-rating").val();

    $("#movie-body").empty();
    // console.log(radius)

    $.ajax({
        url: "https://data.tmsapi.com/v1.1/movies/showings?startDate=" + startDate + "&zip=" + zipCode + "&radius=" + radius + "&units=mi&imageSize=Sm&imageText=true&api_key=" + apiKey,
        method: "GET",
    }).then(function (newMovieResponse) {
        // console.log(newMovieResponse);
        allMyMovies = newMovieResponse;
        for (let i = 0; i < newMovieResponse.length; i++) {

            //getMoviePoster(newMovieResponse[i].title);

            //console.log(posterImage);
            //pass in movie poster
            createCard("movie", newMovieResponse[i].title, posterImage, newMovieResponse[i].shortDescription, i, newMovieResponse[i].tmsId);
            posterImage = "";
        };
        updateMoviePosters()
        movieAPIRun = "#movie"
        randomButtonShowHide()
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Request failed. Show error message to user. 
            // errorThrown has error message, or "timeout" in case of timeout.

            alert(jqXHR.responseText + "-" + errorThrown);

        });


};


function updateMoviePosters() {

    for (let i = 0; i < allMyMovies.length; i++) {
        getMoviePoster(allMyMovies[i].title);

    }

}

function addMoviePoster(movieName, callback) {
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie?api_key=edb8d226b8be97be8b6b5c77df009481&language=en-US&query=" + movieName + "&page=1&include_adult=false",
        method: "GET",
    }).then(function (posterResponse) {
        //console.log(posterResponse);
        //console.log(posterResponse.results["0"].poster_path);
        posterImage = "https://image.tmdb.org/t/p/w400" + posterResponse.results["0"].poster_path;
        // console.log("in Function " + posterImage)
        //$("#img-" + movieName.replace(/\s/g, '')).attr("src", posterImage);
    });

    callback();
};

function getMoviePoster(movieName) {
    //https://api.themoviedb.org/3/search/movie?api_key=edb8d226b8be97be8b6b5c77df009481&language=en-US&query=black%20panther&page=1&include_adult=false
    //var apiKey = "edb8d226b8be97be8b6b5c77df009481";
    //results["0"].poster_path
    //movieName = movieName.replace(/\s/g, '')

    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie?api_key=edb8d226b8be97be8b6b5c77df009481&language=en-US&query=" + movieName + "&page=1&include_adult=false",
        method: "GET",
    }).then(function (posterResponse) {
        //console.log(posterResponse);
        //console.log(posterResponse.results["0"].poster_path);
        posterImage = "https://image.tmdb.org/t/p/w400" + posterResponse.results["0"].poster_path;
        // console.log(posterImage)
        $("#img-" + movieName.replace(/\s/g, '')).attr("src", posterImage);
    });
}

//Yelp API


// var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?term=delis&radius=8000&limit=5&location=" + userZipCode + "&sort_by=rating" + yelpApiKey;
// var clientId = "UElyjnDy2hmjnnI9kg612A"

function runQuery() {
    var yelpApiKey = "XMj-naGXMl6icTElInaXFPwmUXi8YM1ulKFE8p4Y6IN_ia8lvD4-qmDp4EEGWHexFofr5jFGslNRBcDYspVqB1SEdyQiHMLaAanEN-rxLe3Xu8H05YSYgayu_nMZW3Yx";

    var userZipCode = $("#user-zip").val().trim();

    $("#restaurant-body").empty();
    var settings = {
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurant&radius=8000&limit=15&location=" + userZipCode + "&sort_by=rating",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + yelpApiKey
        }
    }

    $.ajax(settings).then(function (response) {
        //console.log(response)
        yelpResults = response.businesses;
        // console.log(yelpResults)
        for (var i = 0; i < yelpResults.length; i++) {

            var bizPhotoUrl = yelpResults[i].image_url;
            var bizName = yelpResults[i].name;
            //var bizCategories = yelpResults[i].categories[i].title;
            var bizRating = yelpResults[i].rating;
            var bizPrice = yelpResults[i].price;
            var bizAddr = yelpResults[i].location.address1;
            var bizCity = yelpResults[i].location.city;
            var bizState = yelpResults[i].location.state;
            var bizZip = yelpResults[i].location.zip_code;
            var bizPhone = yelpResults[i].display_phone;
            var cardBody = "<p>Rating: " + bizRating + "</p><p>Price: " + bizPrice + "</p><p>Address:</p><p>" + bizAddr + "</p><p>" + bizCity + ", " + bizState + " " + bizZip + "</p><p>Phone: " + bizPhone + "</p>"
            createCard("restaurant", bizName, bizPhotoUrl, cardBody, i, yelpResults[i].id);
            yelpAPIRun = "#restaurant"
            randomButtonShowHide()
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {
        // Request failed. Show error message to user. 
        // errorThrown has error message, or "timeout" in case of timeout.

        alert(jqXHR.responseText);
        if (textStatus === "error") {
            $("#user-zip").focus();
        }
    });


};


function updateShowtimes() {
    alert("hello!")
}

function randomButtonShowHide() {
    //console.log("randoButton")
    for (let i = 0; i < sectionsVisable.length; i++) {
        var matchyMatch = 0
        if (sectionsVisable.indexOf(activityAPIRun) != -1) {
            matchyMatch++
        }
        if (sectionsVisable.indexOf(movieAPIRun) != -1) {
            matchyMatch++
        }
        if (sectionsVisable.indexOf(yelpAPIRun) != -1) {
            matchyMatch++
        }
        // console.log(matchyMatch)

    }
    if (matchyMatch === sectionsVisable.length) {
        //$(".randoButton").css("visibility", "visible")
        //$(".randoButton").removeClass('disabled')
        showRandoButton = true
        $("#randoBtn").removeClass('disabled')
    } else {
        $("#randoBtn").attr("class", "btn waves-effect waves-red z-depth-5 disabled")
        showRandoButton = false
        //$(".randoButton").css("visibility", "hidden")
    }

}

function checkRandomButton() {

    if (sectionsVisable.indexOf(activityAPIRun) != -1) {
        //console.log(activityAPIRun)
        $("#selected-activity-body").empty()
        activityType = $("#activity-type").val();
        genRandomNumber(Object.keys(activities[activityType]).length)
        // console.log(randomNumber)
        // console.log(activities[activityType].length)
        $("#selected-activity-body").append($("#activity-body")["0"].children[randomNumber]);
        $($("#selected-activity-body")["0"].children["activity-card"]).attr("id", "selected-card");
        $($("#selected-activity-body")["0"].children["0"].children["0"].children[1]).remove();
        // console.log(randomNumber);
        selectedDateItems.push(activityResults[randomNumber])
        activitySelected = true;

    }
    if (sectionsVisable.indexOf(movieAPIRun) != -1) {
        $("#selected-movie-body").empty()
        genRandomNumber(allMyMovies.length)

        $("#selected-movie-body").append($("#movie-body")["0"].children[randomNumber]);
        $($("#selected-movie-body")["0"].children["movie-card"]).attr("id", "selected-card");
        $($("#selected-movie-body")["0"].children["0"].children["0"].children[1]).remove();
        // console.log(randomNumber);
        selectedDateItems.push(allMyMovies[randomNumber])
        movieSelected = true;

    }
    if (sectionsVisable.indexOf(yelpAPIRun) != -1) {
        //console.log(yelpAPIRun)
        $("#selected-restaurant-body").empty()
        genRandomNumber(yelpResults.length);

        $("#selected-restaurant-body").append($("#restaurant-body")["0"].children[randomNumber]);
        $($("#selected-restaurant-body")["0"].children["restaurant-card"]).attr("id", "selected-card");
        $($("#selected-restaurant-body")["0"].children["0"].children["0"].children[1]).remove();
        // console.log(randomNumber);
        selectedDateItems.push(yelpResults[randomNumber])
        restaurantSelected = true;
    }
};

function genRandomNumber(length) {
    randomNumber = Math.floor(Math.random() * Math.floor(length));
};

//Show/Hide date stuff!
function selectDateParam() {
    var section = "#" + $(this).data("name");
    var dataName = $(this).data("name");
    var state = $(section).css("visibility")
    //console.log(section);
    if (state === "visible") {
        //console.log(state);
        $(section).css("visibility", "hidden");
        if (section != "#random") {
            sectionsVisable.splice($.inArray(section, sectionsVisable), 1);
            $("#btn-" + dataName).attr("class", "waves-effect waves-red btn z-depth-5 red")
            // console.log($.inArray(section, sectionsVisable));
        }
    } else {
        //console.log(state);
        $(section).css("visibility", "visible")
        if (section != "#random") {
            sectionsVisable.push(section);
            $("#btn-" + dataName).attr("class", "waves-effect waves-red btn z-depth-5")
            // console.log($.inArray(section, sectionsVisable));
        }
    };
    randomButtonShowHide()
};


function createCard(dateSection, cardTitle, apiImageURL, cardBodyContent, index, id) {

    //build card
    //cardTitle = cardTitle.replace(/\s/g, '')
    var card = $("<div>");
    card.attr("class", "card");
    card.attr("id", dateSection + "-card");
    card.attr("data-name", cardTitle);

    var cardImage = $("<div>");
    cardImage.attr("class", "card-image");

    var cardImgTag = $("<img>")
    cardImgTag.attr("src", apiImageURL);
    cardImgTag.attr("id", "img-" + cardTitle.replace(/\s/g, ''));

    var imageTitle = $("<span>");
    imageTitle.attr("class", "card-title orange-text text-darken-4");
    imageTitle.text(cardTitle)


    var cardContent = $("<div>");
    cardContent.attr("class", "card-content");
    cardContent.html(cardBodyContent);

    var cardAction = $("<div>");
    cardAction.attr("class", "card-action");
    // var cardAa = $("<a>");
    // cardAa.attr("href", "#");
    // cardAa.attr("id", "modal")
    // cardAa.text("ShowTimes");

    //var cardBody = $("<div>");
    //cardBody.html(cardBodyContent);


    //console.log(card)

    $("#" + dateSection + "-body").append(card);
    card.append(cardImage);
    cardImage.append(cardImgTag);
    //cardImage.append(imageTitle);
    cardImage.append("<a class='btn-floating halfway-fab waves-effect waves-light red " + id + "' data-section=" + dateSection + " data-index=" + index + " data-name=" + id + " id='card-btn'><i class='material-icons'>add</i></a>");
    card.append(cardContent);
    cardContent.prepend(imageTitle);
    card.append(cardAction);
    // if (dateSection === "movie") {
    //     cardAction.append("<a class='waves-effect waves-light btn modal-trigger' href='#modal1'>ShowTimes</a>")
    // } else if (dateSection === "restaurant") {
    //     cardAction.append("<a class='waves-effect waves-light btn modal-trigger' href='#modal1'>Info</a>")
    // }
    //cardContent.append(cardBody);


};

function selectCard() {
    var index = $(this).data("index");
    //console.log(index);
    var id = $(this).data("name");
    // console.log("button pressed");
    // console.log($(this).data("section"));
    if ($(this).data("section") === "restaurant") {
        if (restaurantSelected === false) {
            // console.log(yelpResults[index]);
            selectedDateItems.push(yelpResults[index])
            $("#selected-restaurant-body").append($("#restaurant-body")["0"].children[index]);
            $($("#selected-restaurant-body")["0"].children["restaurant-card"]).attr("id", "selected-card");
            $($("#selected-restaurant-body")["0"].children[1].children["0"].children[1]).remove();
            restaurantSelected = true;
        }
    } else if ($(this).data("section") === "movie") {
        if (movieSelected === false) {
            // console.log(allMyMovies[index]);
            selectedDateItems.push(allMyMovies[index])
            $("#selected-movie-body").append($("#movie-body")["0"].children[index]);
            $($("#selected-movie-body")["0"].children["movie-card"]).attr("id", "selected-card");
            $($("#selected-movie-body")["0"].children[1].children["0"].children[1]).remove();
            movieSelected = true
        }
    } else if ($(this).data("section") === "activity") {
        if (activitySelected === false) {
            //console.log(allMyMovies[index]);
            selectedDateItems.push(activityResults[index])
            // activityResults
            // console.log(index - 1)
            $("#selected-activity-body").append($("#activity-body")["0"].children[index - 1]);
            $($("#selected-activity-body")["0"].children["activity-card"]).attr("id", "selected-card");
            $($("#selected-activity-body")["0"].children[1].children["0"].children[1]).remove();
            activitySelected = true
        }
    }
    // console.log(activitySelected);

}

function saveToFirebase() {
    if (signedInUser != "") {
        var startDate = $("#datepicker").val();
        var html = $($("#Selected-date-items")["0"]).html()
        var activityCard = $($("#Selected-date-items")["0"].children["0"].children["0"].children["0"].children["0"].children["0"]).html();
        var restaurantCard = $($("#Selected-date-items")["0"].children[1].children["0"].children["0"].children["0"].children["0"]).html();
        var movieCard = $($("#Selected-date-items")["0"].children[2].children["0"].children["0"].children["0"].children["0"]).html();
        // Code for the push
        dataRef.ref(signedInUser + "/" + startDate).set({
            date: startDate,
            html: html,
            activity: JSON.stringify(activityCard),
            restaurant: JSON.stringify(restaurantCard),
            movie: JSON.stringify(movieCard),
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    };
};

function runAllAPIs() {
    if (sectionsVisable.indexOf("#movie") != -1) {
        newMovieAPI();
    }
    if (sectionsVisable.indexOf("#restaurant") != -1) {
        runQuery();
    }
    if (sectionsVisable.indexOf("#activity") != -1) {
        activityFunction();
    }
}
//Activity Card
//$("#Selected-date-items")["0"].children["0"].children["0"].children["0"].children["0"].children[1]
//Restaurant Card
//$("#Selected-date-items")["0"].children[1].children["0"].children["0"].children["0"].children[1]
//MovieCard
//$("#Selected-date-items")["0"].children[2].children["0"].children["0"].children["0"].children[1]

//$("select[required]").css({ display: "block", height: 0, padding: 0, width: 0, position: 'absolute' });

$(document).on("click", "#btn-activity", selectDateParam);
$(document).on("click", "#btn-movie", selectDateParam);
$(document).on("click", "#btn-restaurant", selectDateParam);
$(document).on("click", "#card-btn", selectCard);
//$(document).on("click", "#movie-search", newMovieAPI);
//$(document).on("click", "#restaurant-search", runQuery);
$(document).on("click", "#randoBtn", checkRandomButton);
$(document).on("click", "#save-date", saveToFirebase);
//$(document).on("click", "#btn", activityFunction);
$(document).on("click", "#searchButton", runAllAPIs);
// $(document).on("click", "#modal", modal());
$('.modal').modal()
$('.sidenav').sidenav();
$('#activity-type').css("border-bottom: 1px solid green !important")


//$(document).on("click", "#btn-floating", console.log("button"));

