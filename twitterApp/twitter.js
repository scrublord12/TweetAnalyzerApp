var twit = require('twit'),
    twitter = new twit({
        consumer_key: 'S0g3WkpIJZtxTaa9a6W7l5g73',
        consumer_secret: 'zvFZWJFqWrO61YRJ9yiR1Y2dtXK3rLOpVCGB44hye7MZUA1lA6',
        access_token: '2699141594-W0ErGCWuN9sx0e8gOxjZLgh8aKhikFtV8SDJyKu',
        access_token_secret: 'i06EwY9VSVyoQxHiOPfVnC4yYpuhR34jh1s3zS8g6xUIS'
    });

function getTweets(name) {
    twitter.get('statuses/user_timeline', {
        screen_name: name,
        count: '1'
    }, function (error, tweet, response) {
        var tt = tweet;
        console.log(tweet[0].text);
    });

}

module.exports.getTweets = getTweets;