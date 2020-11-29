
$(function () {
    var id = $.urlParam('oid');
    $('#title').text("Order #" + id + " details");

    // get details
    $.ajax({
        type: "get",
        url: getDetailsApiUrl,
        data: {
            oid: id
        },
        success: function(order) {
            ordertable = ''
            total = 0
            $.each(order, function(index, item) {
                total += parseFloat(item.total_price);
                ordertable += '<tr><td>' + item.idproducts + '</td>' +
                    '<td>' + item.name + '</td>' +
                    '<td>' + item.price_per_unit.toFixed(2) + '</td>' +
                    '<td>' + item.quantity + '</td> '+
                    '<td>' + item.total_price.toFixed(2) + '</td></tr>'
            });
            ordertable += '<tr><td colspan="4" style="text-align: end"><b>Total</b></td><td><b>$ '+ total.toFixed(2) +'</b></td></tr>';
            $('table').find('tbody').empty().html(ordertable);
        }
    });

});