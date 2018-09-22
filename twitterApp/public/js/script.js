var inputBox = document.getElementById("us-input");

var buttonClicked = false;

var userEntered = false;

document.getElementById("analyze-button").addEventListener("click", function () {
    if (userEntered) {
        //console.log("cool");
        changeOtherStuff();
        buttonClicked = true;
    }
});

var inputLog = function () {
    verbbose.elementControl();
}

var user;
inputBox.addEventListener("input", function () {
    if (inputBox.value != ("")) {

        //console.log("yeet");
        userEntered = true;


    }
    if (inputBox.value == ("") && buttonClicked) {
        buttonClicked = false;
        $("#tweet-showcase").hide();
        $(".analysis-results").hide();
    }

});

function changeOtherStuff() {

    $("#tweet-showcase").hide().slideDown(500);
    $(".analysis-results").hide().slideDown(500);
    document.getElementById("tweets-from").innerHTML = inputBox.value;
}