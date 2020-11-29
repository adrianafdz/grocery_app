// API
var productListApiUrl = "http://127.0.0.1:5000/getProducts"
var productDeleteApiUrl = "http://127.0.0.1:5000/deleteProduct"
var unitsListApiUrl = "http://127.0.0.1:5000/getUnits"
var saveProductApiUrl = "http://127.0.0.1:5000/insertProduct"
var editProductApiUrl = "http://127.0.0.1:5000/editProduct"
var productApiUrl = "http://127.0.0.1:5000/getProduct"
var saveOrderUpiUrl = "http://127.0.0.1:5000/insertOrder"
var orderListApiUrl = "http://127.0.0.1:5000/getOrders"
var getDetailsApiUrl = "http://127.0.0.1:5000/getDetails"

function callApi(method, url, data) {
    $.ajax({
        method: method,
        url: url,
        data: data
    }).done(function(msg) {
        window.location.reload();
    });
}

function calculateTotal() {
    total = 0.0;
    $(".product-item").each(function (index) {
        priceProduct = parseFloat($(this).find(".product-total").val());
        total += priceProduct;
    });
    
    $("#grand-total").val(total.toFixed(2));
}

// function from https://stackoverflow.com/questions/19491336/how-to-get-url-parameter-using-jquery-or-plain-javascript
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
};