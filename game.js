var budget = 200_000_000_000;


//var bitcoin_index = 1;
var div_list = document.getElementsByClassName("column box");

//function updateBitcoinPrice(value) {
//    var bitcoinParagraph = div_list[bitcoin_index].getElementsByTagName("p")[1];
//    var bitcoinPrice = parseFloat(bitcoinParagraph.innerText.substring(1));
//    bitcoinParagraph.innerText = "$" + value;
//    if (bitcoinPrice < parseFloat(value))
//        bitcoinParagraph.style.color = "lime";
//    else
//        bitcoinParagraph.style.color = "red";
//}

//function retrieveBitcoinPrice() {
//    const pricesWs = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin");
//    pricesWs.onmessage = function (msg) {
//        var obj = JSON.parse(msg.data);
//        if(obj.bitcoin)
//            updateBitcoinPrice(obj.bitcoin);
//    }
//}

function budgetString(str) {
    var finalStr = "";
    var index = str.length;
    while (index > 3) {
        finalStr = "," + str.substring(index - 3, index) + finalStr;
        index -= 3;
    }
    finalStr = str.substring(0, index) + finalStr;
    return finalStr;
}

function updateBudget(value) {
    budget = value;
    document.getElementById("bal").innerText = "$" + budgetString(budget.toString());
    if (budget == 0)
        alert("You won!");
}

updateBudget(budget);


//Set quantity labels to "0"
for (var i = 0; i < div_list.length; ++i) {
    div_list[i].getElementsByTagName("h3")[0].innerHTML = "0";
}

//Button functionality
for (var i = 0; i < div_list.length; ++i) {
    var BUY = div_list[i].getElementsByTagName("a")[0];
    var SELL = div_list[i].getElementsByTagName("a")[1];

    BUY.addEventListener("click", function () {
        var h3 = this.parentElement.getElementsByTagName("h3")[0];
        var str = this.parentElement.getElementsByTagName("p")[1].innerText;
        var price = parseInt(str.substring(1, str.length));
        if (price) {
            if (budget >= price) {
                updateBudget(budget - price);
                h3.innerText = parseInt(h3.innerText) + 1;
            }
        }
    });
    SELL.addEventListener("click", function () {
        var h3 = this.parentElement.getElementsByTagName("h3")[0];
        var quantity = parseInt(h3.innerText);
        var str = this.parentElement.getElementsByTagName("p")[1].innerText;
        var price = parseInt(str.substring(1, str.length));
        if (quantity > 0) {
            h3.innerText = quantity - 1;
            if (price) {
                updateBudget(budget + price);
            }
        }
    });
}

