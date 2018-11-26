require("dotenv").config();
var Spotify = require('node-spotify-api');

var axios = require("axios");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var arguments = grabArguments();
var command = process.argv[2];

switch (command){
    case "concert-this":
    concert(arguments);
    break;

    case "spotify-this-song":
    song();
    break;

    case "movie-this":
    movie();
    break;

    case "do-what-it-says":
    total();
    break;

}

function concert(artistList) {
    var artist;
    // In case no bandname is specified
    if (artistList.length < 1) {
        console.log("Add a band, ya dummy!");
        return;
    }
    artist = artistList[0];
    // Concatenates multi-word band names
    if(artistList.length > 1){
        for (var i = 1; i < artistList.length; i++){
            artist = artist + "+" + artistList[i];
        }
    }

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(
        function(response) {
            // The response comes back as a JSON Array, and I just want the first entry
            console.log(response.data[0].venue);
            artist = artist.replace("+", " ");
            console.log(artist + " is playing at " + response.data[0].venue.name
            + "\nWhich is located at " + response.data[0].venue.city + ", " + response.data[0].venue.region
            + "\nOn " + response.data[0].datetime);
        }
    )
}

// Seemed nicer to set it up here, in case it needs to be called again
function grabArguments(){
    var argumentList = []
    for(var i=3; i<process.argv.length; i ++){
        argumentList.push(process.argv[i]);
    }
    return argumentList;
}