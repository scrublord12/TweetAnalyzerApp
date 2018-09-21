const express = require('express')
const app = express()
var path = require('path')
var bodyParser = require("body-parser");

var module1 = require('./twitter');

var negativeTweets = "20%";
var positiveTweets = "20%";
var neutralTweets = "20%";
var tweet = {
    name: "",
    tweet: "",
    link: "",
    score: ""
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {
        negativeTweets: negativeTweets,
        positiveTweets: positiveTweets,
        neutralTweets: neutralTweets,
        tweet: tweet.tweet
    });
})

app.post("/users/screenName", function (req, res) {
    tweet.name = req.body.screenName;
    console.log(req.body.screenName);

    if (tweet.name != "") {
        module1.getTweets(tweet.name);
    }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})