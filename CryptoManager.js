/*
   
   Link: wss://ws.coincap.io/prices?assets=bitcoin

var cryptoObj = {
    name: "name",
    api_name: "api_name", (name from api)
    image: "link_to_image",
    div_index: int
}

var cryptoList = []

function addCrypto(cryptoObj);

*/

var di = 0;
var rowHTML = "<div class=\"row\">\n            <div class=\"photo\">\n                <img src=\"Photos/Doge.png\">\n            </div>\n            <div class=\"name\">\n                <p>Dogecoin</p>\n            </div>\n            <div class=\"price\">\n                <h3>$200</h3>\n            </div>\n            <div id=\"formContainer\">\n                <form id=\"formC\">\n                <label class=\"theLabels\">\n                    Amount:\n                </label>\n                    <input class=\"theInputs\" type=\"number\"/ min=\"0\">\n                </form>\n            </div>\n                <div class=\"buy\"><a class=\"btnbuy\" href=\"javascript:void(0)\" >Buy</a></div>\n                <div class=\"amount\"><p>caca</p></div>\n                <div class=\"sell\"><a class=\"btnsell\" href=\"javascript:void(0)\" >Sell</a></div>\n        </div>";
var cryptoList = [];
var budget;
console.log(window.localStorage.getItem("budget"));
if (window.localStorage.getItem("budget"))
    budget = parseFloat(localStorage.getItem("budget"));
else
    budget = 100_000;

console.log("Initial budget: " + budget);

function budgetString(num) {
    console.log(num);
    num = num.toFixed(2);
    var integer = parseInt(num.toString()).toString();
    console.log(integer);
    //var index = integer.length;
    //while (index > 3) {
    //    finalStr = "," + integer.substring(index - 3, index) + finalStr;
    //    index -= 3;
    //}
    //finalStr = integer.substring(0, index) + finalStr;
    //finalStr += "." + (num - integer).toString();
    //return finalStr;
    var index = integer.length;
    var finalStr = "";
    while (index > 3) {
        finalStr = "," + integer.substring(index - 3, index) + finalStr;
        index -= 3;
    }
    finalStr = integer.substring(0, index) + finalStr;
    finalStr += "." + num.substring(integer.length + 1, integer.length + 3);
    return finalStr;
}

function updateBudget() {
    document.getElementsByClassName("balance")[0].getElementsByTagName("p")[0].innerText = "$" + budgetString(budget);
    saveProgress();
}

updateBudget();

function addRow(cryptoObject) {
    document.getElementsByClassName("coins")[0].innerHTML += rowHTML;
    var rowList = document.getElementsByClassName("row");
    var latestRow = rowList[rowList.length - 1];
    latestRow.getElementsByTagName("img")[0].src = cryptoObject.image;
    latestRow.getElementsByTagName("p")[0].innerText = cryptoObject.name;
}

function createCrypto(nameValue, imageLink, api_nameValue) {
    var newCrypto = {"name":"name", "image":"image", "div_index":0, "api_name":"api_name"};
    newCrypto.name = nameValue;
    newCrypto.image = imageLink;
    newCrypto.div_index = di++;
    newCrypto.api_name = api_nameValue;
    cryptoList.push(newCrypto);
    addRow(newCrypto);

    return newCrypto;
}

function getPrices() {
    var url = "https://api.coincap.io/v2/assets/";

    for (var i = 0; i < cryptoList.length; ++i) {
        var xmlHttp = new XMLHttpRequest();
        var finalUrl = url + cryptoList[i].api_name.toString();
        xmlHttp.open("GET", finalUrl, false);
        xmlHttp.send();
        var response = JSON.parse(xmlHttp.responseText);
        var row = document.getElementsByClassName("row")[cryptoList[i].div_index];

        var price = parseFloat(response.data.priceUsd);

        if (price < 10)
            row.getElementsByTagName("h3")[0].innerText = "$" + price.toFixed(4);
        else
            row.getElementsByTagName("h3")[0].innerText = "$" + price.toFixed(2);
    }
}

function connectToApi() {
    var url = "wss://ws.coincap.io/prices?assets=";
    for (var i = 0; i < cryptoList.length - 1; ++i) {
        url += cryptoList[i].api_name + ",";
    }
    url += cryptoList[cryptoList.length - 1].api_name;
    const pricesWs = new WebSocket(url);
    pricesWs.onmessage = function (msg) {
        var obj = JSON.parse(msg.data);
        //Check for api_name attributes
        for (var i = 0; i < cryptoList.length; ++i) {
            var currentCrypto = cryptoList[i];
            if (obj.hasOwnProperty(currentCrypto.api_name)) {
                var row = document.getElementsByClassName("row")[currentCrypto.div_index];
                var currentPrice = parseFloat(row.getElementsByTagName("h3")[0].innerText.substring(1));
                var newPrice = parseFloat(obj[currentCrypto.api_name]);
                if (newPrice < 10)
                    newPrice = newPrice.toFixed(4);
                else
                    newPrice = newPrice.toFixed(2);

                if (newPrice > currentPrice)
                    row.getElementsByTagName("h3")[0].style.color = "green";
                else
                    row.getElementsByTagName("h3")[0].style.color = "red";
                row.getElementsByTagName("h3")[0].innerText = "$" + obj[currentCrypto.api_name];
            }
        }
    }

    //var url = "https://api.coinstats.app/public/v1/coins?skip=0&limit=15&currency=USD";
    //var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open("GET", url, false); // false for synchronous request
    //xmlHttp.send(null);
    //var response = xmlHttp.responseText;
    //var obj = JSON.parse(response);
    //console.log(obj);

    //for (var i = 0; i < cryptoList.length; ++i) {
    //    for (var j = 0; j < obj.coins.length; ++j) {
    //        if (cryptoList[i].api_name == obj.coins[j].id) {
    //            var price = parseFloat(obj.coins[j].price);
    //            if (price < 1)
    //                document.getElementsByClassName("price")[cryptoList[i].div_index].getElementsByTagName("h3")[0].innerText = "$" + price.toFixed(4);
    //            else
    //                document.getElementsByClassName("price")[cryptoList[i].div_index].getElementsByTagName("h3")[0].innerText = "$" + price.toFixed(2);
    //        }
    //    }
    //}
}

function initQuantityLabels() {
    for (var i = 0; i < cryptoList.length; ++i) {
        if(window.localStorage.getItem(cryptoList[i].api_name) != null)
            document.getElementsByClassName("amount")[cryptoList[i].div_index].getElementsByTagName("p")[0].innerText = window.localStorage.getItem(cryptoList[i].api_name);
        else
            document.getElementsByClassName("amount")[cryptoList[i].div_index].getElementsByTagName("p")[0].innerText = "0";
    }
}

function initButtons() {
    for (var i = 0; i < cryptoList.length; ++i) {
        var BUY = document.getElementsByClassName("btnbuy")[cryptoList[i].div_index];
        var SELL = document.getElementsByClassName("btnsell")[cryptoList[i].div_index];

        BUY.addEventListener("click", function () {
            var amount = parseInt(this.parentElement.parentElement.getElementsByClassName("amount")[0].getElementsByTagName("p")[0].innerText);
            var desired_amount = parseInt(this.parentElement.parentElement.getElementsByClassName("theInputs")[0].value);
            var cryptoPrice = parseFloat(this.parentElement.parentElement.getElementsByClassName("price")[0].getElementsByTagName("h3")[0].innerText.substring(1));
            if (desired_amount * cryptoPrice < budget && desired_amount > 0) {
                budget -= desired_amount * cryptoPrice;
                amount += desired_amount;
                this.parentElement.parentElement.getElementsByClassName("amount")[0].getElementsByTagName("p")[0].innerText = amount;
                updateBudget();
            }
        });
        SELL.addEventListener("click", function () {
            var amount = parseInt(this.parentElement.parentElement.getElementsByClassName("amount")[0].getElementsByTagName("p")[0].innerText);
            var desired_amount = parseInt(this.parentElement.parentElement.getElementsByClassName("theInputs")[0].value);
            var cryptoPrice = parseFloat(this.parentElement.parentElement.getElementsByClassName("price")[0].getElementsByTagName("h3")[0].innerText.substring(1));
            if (desired_amount <= amount && desired_amount > 0) {
                budget += desired_amount * cryptoPrice;
                amount -= desired_amount;
                this.parentElement.parentElement.getElementsByClassName("amount")[0].getElementsByTagName("p")[0].innerText = amount;
                updateBudget();
            }
        });
    }
}

function saveProgress() {
    window.localStorage.setItem("budget", budget.toString());
    for (var i = 0; i < cryptoList.length; ++i) {
        window.localStorage.setItem(cryptoList[i].api_name, document.getElementsByClassName("amount")[i].getElementsByTagName("p")[0].innerText);
    }
}

createCrypto("Bitcoin", "Photos/Crypto/bitcoin.png", "bitcoin");
createCrypto("Dogecoin", "Photos/Crypto/Doge.png", "dogecoin");
createCrypto("Ripple", "Photos/Crypto/ripple.png", "xrp");
createCrypto("Ethereum", "Photos/Crypto/ethereum.png", "ethereum");
createCrypto("Cardano", "Photos/Crypto/cardano.png", "cardano");
createCrypto("Litecoin", "Photos/Crypto/litecoin.png", "litecoin");
createCrypto("Binance Coin", "Photos/Crypto/binancecoin.png", "binance-coin");
createCrypto("Matic", "Photos/Crypto/matic.png", "matic-network");
createCrypto("Bitcoin Cash", "Photos/Crypto/bitcoincash.png", "bitcoin-cash");
createCrypto("Chainlink", "Photos/Crypto/chainlink.png", "chainlink");


initQuantityLabels();
initButtons();

getPrices();

connectToApi();