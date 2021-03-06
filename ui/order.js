$("#additem").click(function() {
    var box = $(".product-box").html();
    $("#order-items").append(box);
});

$(function(){
    $.get(productListApiUrl, function(response) {
        prodPrices = {}
        prodScales = {}
        var options = '<option value="0"> -- SELECT -- </option>';
        if (response) {
            $.each(response, function(index, product) {
                options += '<option value="' + product.idproducts + '">' + product.name + '</option>';
                prodPrices[product.idproducts] = product.price_per_unit;
                prodScales[product.idproducts] = product.idunit;
            });
            $(".cart-product").empty().html(options);
        } 
    });
});

$(document).on('change', '.cart-product' , function(){
    priceField = $(this).closest(".row").find(".product-price");
    qtyField = $(this).closest(".row").find(".product-qty");
    
    prodId = $(this).val();
    priceField.val(prodPrices[prodId]);

    // adjust quantity scale
    if (prodScales[prodId]==1) {
        qtyField.attr("step", "1");
    } else {
        qtyField.attr("step", "0.01");
    }
    if ($(this).closest(".row").find(".cart-product").val() != 0) {
        $(this).closest(".row").find(".discountBtn").removeClass("hiddenBox");
    } else {
        $(this).closest(".row").find(".discountBtn").addClass("hiddenBox");
    }
});

$(document).on('change', '.product-qty' , function(){
    totalField = $(this).closest(".row").find(".product-total");
    price = parseFloat($(this).closest(".row").find(".product-price").val());
    qty = parseFloat($(this).closest(".row").find(".product-qty").val());
    total = price * qty;
    totalField.val(total.toFixed(2));
    calculateTotal();
});

$(document).on('click', '.remove-row' , function(){
    $(this).closest('.contenido').remove();
    calculateTotal();
});

$("#save-order").on('click', function() {
    var formData = $("form").serializeArray();

    order = {
        customer_name: null,
        grand_total: null,
        order_details: []
    };

    var details = []
    var pos = -1; 
    for (var i=0; i<formData.length; i++) {
        var elem = formData[i];

        switch (elem.name) {
            case 'customer_name':
                order.customer_name = elem.value;
                break;
            case 'product':
                pos += 1;
                details.push({
                    idproducts: elem.value,
                    quantity: null,
                    total_price: null
                });
                break;
            case 'qty':
                details[pos].quantity = elem.value;
                break;
            case 'item_total':
                details[pos].total_price = elem.value;
                break;
            case 'grand_total':
                order.grand_total = elem.value;
                break;
            default:
                break;
        };
    }

    order.order_details = details;
    console.log(order);

    callApi("POST", saveOrderUpiUrl, {
        'data': JSON.stringify(order)
    });

});


var discountModal = $('#discountModal');
    discountModal.on('show.bs.modal', function(){
        $("#discount").val('0');
        $("#newPrice").val('0.00');
        discountModal.find('.modal-title').text('Discount - ');
    });

    $(document).on('click', '.discountBtn' , function(){
        $(this).closest('.row').find('.product-total').addClass("selecteditem");

        var pname = $(this).closest('.row').find('option:selected').text();
        discountModal.find('.modal-title').text('Discount - ' + pname);

        discountprice = $(this).closest('.row').find('.product-total').val();
        $('#newPrice').val(discountprice);
    });

    $(document).on('change', '#discount' , function(){
        var percent = $(this).val() / 100;
        newprice = (discountprice * (1 - percent))
        $('#newPrice').val(newprice.toFixed(2));
    });

    $('#savediscount').on('click', function(){
        $('.selecteditem').val( parseFloat($('#newPrice').val()).toFixed(2) );
        discountModal.modal('hide');
        calculateTotal();
    });

    discountModal.on('hide.bs.modal', function(){
        $('.selecteditem').removeClass("selecteditem");
        discountprice = 0;
        newprice = 0;
    });