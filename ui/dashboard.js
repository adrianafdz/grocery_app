$(function(){
    $.get(orderListApiUrl, function(response) {
        if (response) {
            ordertable = ''
            total = 0
            
            $.each(response, function(index, order) {
                total += parseFloat(order.total);
                var datetime = new Date(order.date);
                ordertable += '<tr data-id="'+ order.idorders+'"><td>' + order.idorders + '</td>' +
                    '<td>' + datetime.toDateString() + '</td>' +
                    '<td>' + order.customer_name + '</td>' +
                    '<td>' + order.total.toFixed(2) + '</td> '+
                    '<td><a href="details.html?oid='+ order.idorders +'"role="button" class="view-more btn btn-sm btn-outline-dark">View details</a></td></tr>';
            });

            ordertable += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td colspan="2"><b>$ '+ total.toFixed(2) +'</b></td></tr>';
            $("table").find("tbody").empty().html(ordertable);
        }
    });
});

$(document).on("click", ".view-more", function() {
    var tr = $(this).closest('tr');
    console.log(tr.data('id'));
});