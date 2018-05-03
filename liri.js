// Dotenv is a zero-dependency module that loads environment variables 
require("dotenv").config();

// importing keys.js into variable
var keys = require('./keys.js');

// fs package to read and write
var fs = require('fs');

// Loading Spotify package
var Spotify = require('node-spotify-api');

// Loading Twitter package
var Twitter = require('twitter');

// Loading request package
var request = require('request');

// Accessing spotify keys from keys.js
var spotify = new Spotify(keys.spotify);

// Accessing Twitter keys
var client = new Twitter(keys.twitter);

// stores all command line arguments
var nodeArgs = process.argv;

// storing the the movie name as a string
var movieName = '';

// storing the song name as a string
var songName = '';

// Omdb movie function
function movieThis() {

    // looping through all the words in the node argument and storing everything 
    // after the 3rd arugment and storing them as the movie name

    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            movieName = movieName + '+' + nodeArgs[i];
        }
        else {

            movieName += nodeArgs[i];
        }
    }

    //Request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


    request(queryUrl, function (error, response, body) {

        console.log("--------------------------------------------------------------------------------");
        console.log('Title: ' + JSON.parse(body).Title);
        console.log('Year: ' + JSON.parse(body).Year);
        console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
        console.log('Country where movie was produced: ' + JSON.parse(body).Country);
        console.log('Language of the movie: ' + JSON.parse(body).Language);
        console.log('Plot: ' + JSON.parse(body).Plot);
        console.log('Actors in the movie: ' + JSON.parse(body).Actors);
        console.log("--------------------------------------------------------------------------------");
    })

}

// Spotify-this-song fucntion
function spotifyThis() {

    // Looping through the command line arguments to get the songname
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            songName = songName + '+' + nodeArgs[i];
        }
        else {

            songName += nodeArgs[i];
        }
    }

    // Using the Spotify package to search the song
    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, response) {

        // if error occurs it will be logged
        if (err) {
            return console.log('error occured' + err);
        }

        // sotring the object results into a variable
        var songInfo = response.tracks.items[0];


        console.log('--------------------------')
        console.log('Artist: ' + songInfo.artists[0].name)
        console.log('Song: ' + songInfo.name)
        console.log('Preview Song: ' + songInfo.preview_url)
        console.log('Album: ' + songInfo.album.name)
        console.log('--------------------------')
    })

}

// my-tweet function
function myTweets() {

    // var screenName = process.argv[3];

    // setting the screen name to the one I created
    var params = { screen_name: 'ajv_xiii' };

    // twitter package to get the user timeline
    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {

            for (let key in tweets) {
                console.log('tweet: ' + tweets[key].text)
            }
        }
    });

}

// do-what-it-says function
function doWhatItSays() {

    // using the fs package to read the random.txt file
    fs.readFile('random.txt', 'utf8', function (error, data) {

        // if there is an error it will be console logged
        if (error) {
            console.log(error);
        }

        // the data will be console logged
        console.log(data);

        // data will be split
        const args = data.split(',');

        // the command will be set to the 1st argument of the data
        const command = args[0];

        // the argument will be set to the 2nd argument
        const argument = args[1];

        // running the command to spotify a song
        if (command === 'spotify-this-song') {

            spotify.search({ type: 'track', query: argument, limit: 1 }, function (err, response) {
                if (err) {
                    return console.log('error occured' + err);
                }
                var songInfo = response.tracks.items[0];

                console.log('--------------------------')
                console.log('Artist: ' + songInfo.artists[0].name)
                console.log('Song: ' + songInfo.name)
                console.log('Preview Song: ' + songInfo.preview_url)
                console.log('Album: ' + songInfo.album.name)
                console.log('--------------------------')


            })

        }
    })
}

// switch statement to perform different actions based on the command
switch (nodeArgs[2]) {

    // my tweets function will run
    case 'my-tweets':
        myTweets();
        break;

// spotify function will run
    case 'spotify-this-song':
        if (nodeArgs[3]) {
            spotifyThis()
            break;
        } else { //if node argument is empty, spotify will search The Sign by Ace of Base
            songName = 'The Sign Ace of Base';
            spotifyThis(songName)
        }
        break
        
        // movie-this function will run
    case 'movie-this':
        if (nodeArgs[3]) {
            movieThis();
            break;
        } else {  // if node argument is empty, spotify will search for the movie Mr. Nobody
            movieName = 'Mr. Nobody'
            movieThis(movieName);
            break;
        }

        // do what it says function
    case 'do-what-it-says':
        doWhatItSays();
}
