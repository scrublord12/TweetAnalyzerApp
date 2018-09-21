var twit = require('twit'),
    twitter = new twit({
        consumer_key: 'S0g3WkpIJZtxTaa9a6W7l5g73',
        consumer_secret: 'zvFZWJFqWrO61YRJ9yiR1Y2dtXK3rLOpVCGB44hye7MZUA1lA6',
        access_token: '2699141594-W0ErGCWuN9sx0e8gOxjZLgh8aKhikFtV8SDJyKu',
        access_token_secret: 'i06EwY9VSVyoQxHiOPfVnC4yYpuhR34jh1s3zS8g6xUIS'
    });

var Sentiment = require('sentiment');
var sentiment = new Sentiment();

var tweets = [];

function getTweets(name) {


    twitter.get('statuses/user_timeline', {
        screen_name: name,
        count: '200',
        tweet_mode: 'extended'

    }, function (error, tweet, response) {
        //var tweetsArray = tweetObj[tweet.length];
        for (var i = 0; i < tweet.length; i++) {
            tweets.push({
                name: name,
                text: tweet[i].full_text,
                date_posted: tweet[i].created_at,
                score: ""
            })
        }
        var sentimentScores=analyzeT();
        //console.log(tweets);
        

    });

}

function analyzeT(){
    //compare words from the tweetObj to the affin list
    for(var i=0; i < tweets.length; i++){
        tweets[i].score = sentiment.analyze(tweets[i].text).comparative;
    }
    var positive=0;
    var negative=0;
    var neutral=0;
    for(var i = 0; i < tweets.length; i++){
        if(tweets[i].score > 0){
            positive++;
        }else if(tweets[i].score < 0){
            negative++;
        }else if(tweets[i].score == 0){
            neutral++;
        }
    }
    console.log(positive+ " "+negative+" "+neutral);
    positive = (positive/tweets.length)*100;
    negative = (negative/tweets.length)*100;
    neutral = (neutral/tweets.length)*100;
    console.log(positive+ " "+negative+" "+neutral);
    console.log("positive: "+ positive + "% "+"neutral: " + neutral + "% " + "negative: " + negative + "%");
    return {positive: positive, negative: negative, neutral: neutral};
}

module.exports.getTweets = getTweets;