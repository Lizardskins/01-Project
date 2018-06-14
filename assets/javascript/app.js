//firebase

var userZipCode = 0;
var allMovieTitlesArr = [];
var posterImage = "";
var allMyMovies = [];
var selectedDateItems = [];
var yelpResults = [];
var sectionsVisable = ["#activity", "#movie", "#restaurant"];
var yelpAPIRun = "";
var movieAPIRun = "";
var activityAPIRun = "";
var randomNumber = 0
var activities = {
    outdoor: {
        0: "Batting Cages",
        1: "Rent a convertable for the day",
        2: "River Rafting",
        3: "State Fair or Carnival",
        4: "Drive-in Movie",
        5: "Geocaching",
        6: "Go Fishing",
        7: "Picnic",
        8: "Hit the Beach",
        9: "Outdoor Concert",
        10: "Cycling",
        11: "Driving Range",
        12: "Go for a Hike",
        13: "Horseback Riding",
        14: "Boatride"
    },
    indoor: {
        0: "Bowling",
        1: "Enjoy an Art Museum",
        2: "Find a Local Bar",
        3: "Video Game Tournament",
        4: "Build a Fire",
        5: "Cook a fancy meal",
        6: "Bake a cake",
        7: "Concert",
        8: "Boardgame",
        9: "Go to the arcade",
        10: "Wine and cheese night",
        11: "Shop at the nicest mall",
        12: "Rock Climbing",
        13: "Comedy Show",
        14: "Aquarium"
    },
    cheap: {
        0: "Picnic",
        1: "Hiking",
        2: "Hit the Beach",
        3: "Go Fishing",
        4: "Boardgame",
        5: "Bake a cake",
        6: "Happy Hour",
        7: "Do Yoga",
        8: "Make a bucketlist",
        9: "Netflix",
        10: "Go to the thrift store",
        11: "Make a fire",
        12: "Stargazing",
        13: "Bowling",
        14: "Movie Marathon"
    },
    fancy: {
        0: "Horseback Riding",
        1: "Boatride",
        2: "Rent a convertable for the day",
        3: "Make a fancy meal",
        4: "Skiing",
        5: "Hot air balloon ride",
        6: "Sky Diving",
        7: "Dinner for two",
        8: "Go to a concert",
        9: "Shop at the nicest mall",
        10: "Go for a weekend getaway",
        11: "Wine-tasting",
        12: "Go to the spa",
        13: "Take a dance class",
        14: "Hire a private chef"
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
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
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
        console.log(error);
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
        console.log(error);
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


});

function activityFunction(activityType) {
    activityType = $("#activity-type").val();
    // var obj = { "act": activityType }
    // console.log(obj.activityType)

    // activtyTypeObject = JSON.stringify(obj);
    console.log(activities[activityType])


    // console.log(activtyTypeObject);
    // console.log(activityTypeObject["act"]);
    // console.log(activities.activityTypeObject)

    // for (var i = 0; i < 15; i++) {

    //     createCard("activity", "", "", activities[activityType][i], "", "");

    // }

}
//activityFunction();


//tmsapi movie api
function newMovieAPI() {
    //http://data.tmsapi.com/v1.1/movies/showings?startDate=2018-06-10&zip=84094&radius=20&units=mi&imageSize=Sm&imageText=true&api_key=prqret794d2txbvwk62p3jsv
    var apiKey = "prqret794d2txbvwk62p3jsv";
    var zipCode = $("#user-zip").val().trim();
    var radius = $("#movie-radius").val();
    var startDate = $("#datepicker").val(); //"2018-06-11"
    var movieRating = $("#movie-rating").val();

    $("#movie-body").empty();
    console.log(radius)

    $.ajax({
        url: "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + startDate + "&zip=" + zipCode + "&radius=" + radius + "&units=mi&imageSize=Sm&imageText=true&api_key=" + apiKey,
        method: "GET",
    }).then(function (newMovieResponse) {
        console.log(newMovieResponse);
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
        console.log("in Function " + posterImage)
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
        console.log(posterImage)
        $("#img-" + movieName.replace(/\s/g, '')).attr("src", posterImage);
    });
}

//Yelp API


// var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?term=delis&radius=8000&limit=5&location=" + userZipCode + "&sort_by=rating" + yelpApiKey;
// var clientId = "UElyjnDy2hmjnnI9kg612A"

function runQuery() {
    var yelpApiKey = "XMj-naGXMl6icTElInaXFPwmUXi8YM1ulKFE8p4Y6IN_ia8lvD4-qmDp4EEGWHexFofr5jFGslNRBcDYspVqB1SEdyQiHMLaAanEN-rxLe3Xu8H05YSYgayu_nMZW3Yx";

    var userZipCode = $("#user-zip").val().trim()
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
        console.log(yelpResults)
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



function checkRandomButton() {
    if (sectionsVisable.indexOf(activityAPIRun)) {
        console.log(activityAPIRun)
    }
    if (sectionsVisable.indexOf(movieAPIRun)) {

        /**
        //console.log(movieAPIRun)
        // genRandomNumber(allMyMovies.length);
        //getMoviePoster(allMyMovies[randomNumber].title)
        // console.log(randomNumber);
        //console.log(posterImage);
        // addMoviePoster(allMyMovies[randomNumber].title, function () {
        //     createCard("selected-movie", allMyMovies[randomNumber].title, posterImage, allMyMovies[randomNumber].shortDescription, randomNumber, allMyMovies[randomNumber].tmsId)
        // });

        //setTimeout(getMoviePoster(allMyMovies[randomNumber].title), 5000)
        //getMoviePoster(allMyMovies[randomNumber].title)

        // createCard("selected-movie", allMyMovies[randomNumber].title, posterImage, allMyMovies[randomNumber].shortDescription, randomNumber, allMyMovies[randomNumber].tmsId);
        // console.log(posterImage);
        //updateMoviePosters();
        //posterImage = "";
        */

        $("#selected-movie-body").append($("#movie-body")["0"].children[randomNumber]);



    }
    if (sectionsVisable.indexOf(yelpAPIRun)) {
        console.log(yelpAPIRun)
    }
};

function genRandomNumber(length) {
    randomNumber = Math.floor(Math.random() * Math.floor(length));
};

//Show/Hide date stuff!
function selectDateParam() {
    var section = "#" + $(this).data("name");
    var state = $(section).css("visibility")
    //console.log(section);
    if (state === "visible") {
        //console.log(state);
        $(section).css("visibility", "hidden");
        if (section != "#random") {
            sectionsVisable.splice($.inArray(section, sectionsVisable), 1);
            console.log($.inArray(section, sectionsVisable));
        }
    } else {
        //console.log(state);
        $(section).css("visibility", "visible")
        if (section != "#random") {
            sectionsVisable.push(section);
            console.log($.inArray(section, sectionsVisable));
        }
    };
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

    if ($(this).data("section") === "restaurant") {
        console.log(yelpResults[index]);
        selectedDateItems.push(yelpResults[index])
    } else if ($(this).data("section") === "movie") {
        console.log(allMyMovies[index]);
        selectedDateItems.push(allMyMovies[index])
    } else if ($(this).data("section") === "activity") {
        //console.log(allMyMovies[index]);
        //selectedDateItems.push(allMyMovies[index])
    }


    //selectedDateItems.push(allMyMovies[index])
    //console.log($(this).parent().parent().html());
    var card = $("<div>");
    card.attr("class", "card");
    card.attr("id", "selected-card");

    $("#selected-" + $(this).data("section")).append(card);
    card.append($(this).parent().parent().html());
    $("." + id).remove("a")


}


$(document).on("click", "#btn", selectDateParam);
$(document).on("click", "#card-btn", selectCard);
$(document).on("click", "#movie-search", newMovieAPI);
$(document).on("click", "#restaurant-search", runQuery);
// $(document).on("click", "#modal", modal());
$('.modal').modal()
$('.sidenav').sidenav();


//$(document).on("click", "#btn-floating", console.log("button"));

