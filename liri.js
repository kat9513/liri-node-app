require("dotenv").config();

var fs = require('fs');

var Spotify = require('node-spotify-api');

var axios = require("axios");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
//console.log(spotify);


var arguments = grabArguments();
var command = process.argv[2];

function parseCommand(inputCommand, inputArguments) {
    switch (inputCommand) {
        case "concert-this":
            concert(inputArguments);
            break;

        case "spotify-this-song":
            song(inputArguments);
            break;

        case "movie-this":
            movie(inputArguments);
            break;

        case "do-what-it-says":
            total(inputArguments);
            break;

    }
}

parseCommand(command, arguments);

function concert(artistList) {
    var artist;
    // In case no bandname is specified
    if (artistList.length < 1) {
        console.log("Add a band, ya dummy!");
        return;
    }
    artist = artistList[0];
    // Concatenates multi-word band names
    if (artistList.length > 1) {
        for (var i = 1; i < artistList.length; i++) {
            artist = artist + "+" + artistList[i];
        }
    }

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(
            function (response) {
                // The response comes back as a JSON Array, and I just want the first entry
                console.log(response.data[0].venue);
                artist = artist.replace("+", " ");
                console.log(artist + " is playing at " + response.data[0].venue.name
                    + "\nWhich is located at " + response.data[0].venue.city + ", " + response.data[0].venue.region
                    + "\nOn " + response.data[0].datetime);
            }
        )
}


function song(songsList) {
    //console.log(spotify.id);
    var songs;
    if (songsList.length < 1) {
        console.log("Add a song, dingus!");
        return;
    }
    songs = songsList[0];
    if (songsList.length > 1) {
        for (var i = 1; i < songsList.length; i++) {
            songs = songs + " " + songsList[i];
        }
    }
    console.log(songs)
    spotify.search({ type: 'track', query: songs, }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });
}

function movie(movieList) {
    var movies;
    if (movieList.length < 1) {
        axios.get("https://www.omdbapi.com/?t=Mr.+Nobody&apikey=" + process.env.OMDB_KEY)
            .then(function (response) {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country of production: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            }

            )
    }
    movies = movieList[0];
    if (movieList.length > 1) {
        for (var i = 1; i < movieList.length; i++) {
            movies = movies + "+" + movieList[i];
        }
    }
    axios.get("https://www.omdbapi.com/?t=" + movies + "&apikey=" + process.env.OMDB_KEY)
        .then(
            function (response) {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country of production: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            }
        )
        .catch(error => {
            console.log(error.response)
        }
        )
}

function total() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);

        var dataArr = data.split(",");

        var txtcommand = dataArr[0];

        var txtargument = dataArr[1].slice(1, -1).split(" ");

        console.log(txtargument);

        parseCommand(txtcommand, txtargument);

    })

}

// Seemed nicer to set it up here, in case it needs to be called again
function grabArguments() {
    var argumentList = []
    for (var i = 3; i < process.argv.length; i++) {
        argumentList.push(process.argv[i]);
    }
    return argumentList;
}