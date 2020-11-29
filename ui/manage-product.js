var productModal = $('#productModal');
var editModal = $('#editModal');

    // Products table
    $(function() {
        // JSON data by API call
        $.get(productListApiUrl, function(response) {
            if (response) {
                var table=''
                $.each(response, function(index, product) {
                    table += '<tr data-id="' + product.idproducts + '" data-name="' + product.name + 
                    '" data-unit="' + product.idunit + '" data-price="' + product.price_per_unit + '">' +
                    '<td>' + product.name + '</td>' +
                    '<td>' + product.unit_name + '</td>' +
                    '<td>' + product.price_per_unit.toFixed(2) + '</td>' +
                    '<td><span class="btn btn-xs btn-danger delete-product">Delete</span>' +
                    '<button type="button" class="btn btn-xs btn-warning edit-product" data-toggle="modal" data-target="#editModal">Edit</button><td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    // New product modal (close)
    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #units, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    // New product modal (open) - populate dropdown
    productModal.on('show.bs.modal',function(){
        $.get(unitsListApiUrl, function(response) {
            if (response) {
                var drop = ''
                $.each(response, function(index, unit) {
                    drop += '<option value="' + unit.idunit + '">' + unit.unit_name + '</option>'
                });
                $("#units").empty().html(drop);
            }
        });
    });

    // Delete button
    $(document).on("click", ".delete-product", function() {
        var tr = $(this).closest('tr');
        // request
        var data = {
            idproducts: tr.data('id')
        };
        var isDelete = confirm("Are you sure you want to delete " + tr.data('name') + "?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    // Save new product
    $('#saveProduct').on("click", function(){
        
        var formData = $("#productForm").serializeArray(); // get all elements of form (key value pairs)
        var requestPayload = {
            name: null,
            idunit: null,
            price_per_unit: null
        };

        for (var i=0; i<formData.length; i++) {
            var element = formData[i]

            switch(element.name) {
                case 'name':
                    requestPayload.name = element.value
                    break;
                case 'units':
                    requestPayload.idunit = element.value
                    break;
                case 'price':
                    requestPayload.price_per_unit = element.value
                    break;
            }
        }
       
        callApi("POST", saveProductApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });


    // EDIT PRODUCT MODAL
    // open modal
    $(document).on("click", ".edit-product", function() {
        // get selected row /product
        var tr = $(this).closest('tr');

        // populate units
        $.get(unitsListApiUrl, function(response) {
            if (response) {
                var drop = ''
                
                $.each(response, function(index, unit) {
                    drop += '<option value="' + unit.idunit + '" ';
                    if (unit.idunit == tr.data('unit')) {
                        drop += 'selected="selected"';
                    }
                    drop += '>' + unit.unit_name + '</option>';
                });
                $("#unitEdit").empty().html(drop);
            }
        });

        // get product values from db
        $.ajax({
            type: "get",
            url: productApiUrl,
            data: {
                idproducts: tr.data('id')
            },
            success: function(product) {
                console.log(product[0]);
                $("#idEdit").val(product[0]['idproducts'])
                $("#nameEdit").val(product[0]['name']);
                $("#priceEdit").val(product[0]['price_per_unit']);
            }
        });

        // populate fields with current product values from row
        // console.log(tr.data('id'))
        // $("#idEdit").val(tr.data('id'))
        // $("#nameEdit").val(tr.data('name'));
        // $("#priceEdit").val(tr.data('price'));
    });

    // save edit
    $('#saveEdit').on("click", function(){
        var formData = $("#editForm").serializeArray();
        var requestPayload = {
            idproduct: null,
            name: null,
            idunit: null,
            price_per_unit: null
        };

        for (var i=0; i<formData.length; i++) {
            var element = formData[i];
            switch (element.name) {
                case 'idEdit':
                    requestPayload.idproduct = element.value;
                    break;
                case 'nameEdit':
                    requestPayload.name = element.value;
                    break;
                case 'unitEdit':
                    requestPayload.idunit = element.value;
                    break;
                case 'priceEdit':
                    requestPayload.price_per_unit = element.value;
                    break;
            }
        }

        callApi("POST", editProductApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });

    // Close edit modal
    editModal.on('hide.bs.modal', function(){
        $("#idEdit").val('0');
        $("#nameEdit, #unitEdit, #priceEdit").val('');
        productModal.find('.modal-title').text('Edit Product');
    });
