const express = require('express')
const app = express()
var path = require('path')
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var twit = require('twit'),
    twitter = new twit({
        consumer_key: 'S0g3WkpIJZtxTaa9a6W7l5g73',
        consumer_secret: 'zvFZWJFqWrO61YRJ9yiR1Y2dtXK3rLOpVCGB44hye7MZUA1lA6',
        access_token: '2699141594-W0ErGCWuN9sx0e8gOxjZLgh8aKhikFtV8SDJyKu',
        access_token_secret: 'i06EwY9VSVyoQxHiOPfVnC4yYpuhR34jh1s3zS8g6xUIS'
    });

var Sentiment = require('sentiment');
var sentimentA = new Sentiment();

//var tweets = [];

var negativeTweets = "20";
var positiveTweets = "20";
var neutralTweets = "20";
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
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {
        negativeTweets: negativeTweets,
        positiveTweets: positiveTweets,
        neutralTweets: neutralTweets,
        tweet: tweet.tweet,
        screenName: "",
        show: false
    });
})

app.post("/users/screenName", urlencodedParser, async function (req, res) {
    
    tweet.name = req.body.screenName;
    console.log(req.body.screenName);
    var analyzedData = await tweetAnalyzeProcess(tweet.name).then(results => {
        return results;
    });
    console.log(analyzedData.tweetData[1]);
    res.render('index', {
        negativeTweets: analyzedData.sentimentData[0].negative,
        positiveTweets: analyzedData.sentimentData[0].positive,
        neutralTweets: analyzedData.sentimentData[0].neutral,
        tweets: analyzedData.tweetData,
        screenName: tweet.name,
        show: true
    })
    
})

function getTweets(name){
    return new Promise(function(resolve, reject){

        twitter.get('statuses/user_timeline', {
            screen_name: name,
            count: '200',
            tweet_mode: 'extended'
        }, function (error, tweetObj, response) {
            if(!error){
                var tweets = [];
                //var tweetsArray = tweetObj[tweet.length];
                for (var i = 0; i < tweetObj.length; i++) {
                    tweets.push({
                        name: tweetObj[i].user.name,
                        text: tweetObj[i].full_text,
                        date_posted: tweetObj[i].created_at,
                        link: "https://twitter.com/" + tweetObj[i].user.screen_name +"/status/" + tweetObj[i].id_str,
                        user_link: "https://twitter.com/" + tweetObj[i].user.screen_name,
                        score: ""
                    })
                }
                
                resolve(tweets);
            }
        })
    })
}

function analyzeTweets(tweetsData){
    return new Promise(function (resolve, reject){
        
        for (var i = 0; i < tweetsData.length; i++) {
            tweetsData[i].score =  sentimentA.analyze(tweetsData[i].text).comparative;
        }
        var positive = 0;
        var negative = 0;
        var neutral = 0;
        for (var i = 0; i < tweetsData.length; i++) {
            if (tweetsData[i].score > 0) {
                positive++;
            } else if (tweetsData[i].score < 0) {
                negative++;
            } else if (tweetsData[i].score == 0) {
                neutral++;
            }
        }
    
        //console.log(positive + " " + negative + " " + neutral);
        positive = (positive / tweetsData.length) * 100;
        negative = (negative / tweetsData.length) * 100;
        neutral = (neutral / tweetsData.length) * 100;
        //console.log(positive + " " + negative + " " + neutral);
        console.log("positive:" + positive + "% " + "neutral:" + neutral + "% " + "negative:" + negative + "%");
        var analyzedResults = [{
            positive: positive,
            negative: negative,
            neutral: neutral
        }];

        resolve(analyzedResults);

    })
}

async function tweetAnalyzeProcess(name){
    var tweetData = await getTweets(name);
    var sentimentData = await analyzeTweets(tweetData);

    var analyzedData = {tweetData: tweetData, sentimentData: sentimentData};
    //console.log(entireData);
    return analyzedData;
}

app.listen(80, function () {
    console.log('Example app listening on port 80!')
})