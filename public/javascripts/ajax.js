


// ajax for cart

$(document).ready(function () {
    $(".add-to-cart-spinner").addClass("d-none");

});


// addtocart

function addToCart(Id) {
    // $("#add-to-cart-text" + Id).addClass("d-none");
    $("#add-to-cart-spinner" + Id).addClass("spinner-border");
    $.ajax({
        url: '/addToCart/' + Id,
        method: 'post',
        data: {
            productid: Id
        },
        success: (response) => {
            let count = response.itemCount.totalQty;
            $('#cart-count').html(count)
            $("#add-to-cart-text" + Id).removeClass("d-none");
            $(".spinner-border").removeClass("spinner-border");

            swal("Added to cart!", "Item added to cart Successfully!", "success");
        }
    })

}

// delete from cart 

function deleteCartProduct(Id) {
    swal({
        title: "Are you sure?",
        text: "Delete this item from Cart",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/delete-cart-item/' + Id,
                    method: "post",
                    success: (response) => {
                        location.reload()
                    }
                })
            }
        });


}



// change single item quantity 

function addCount(Id, Count) {
    $.ajax({
        url: '/changeqty/',
        data: {
            id: Id,
            count: Count
        },
        method: 'post',
        success: (response) => {
            let count = $('#' + Id).val()
            let amount = $('#price' + Id).html()
            let price = (amount / count)
            count++
            let newprice = price * count
            $('#' + Id).val(count)
            $('#price' + Id).html(newprice)
            $('.totalcost').html(response.totalCost)
        }
    })
}


function decCount(Id, Count) {
    $.ajax({
        url: '/changeqty/',
        data: {
            id: Id,
            count: Count
        },
        method: 'post',
        success: (response) => {
            if (response) {
                let count = $('#' + Id).val()
                let totalprice = $('#price' + Id).html()
                let price = (totalprice / count)
                count--
                if (count <= 1) {
                    location.reload()
                }
                $('#' + Id).val(count)
                let newprice = price * count
                $('#' + Id).val(count)
                $('.totalcost').html(response.totalCost)
                $('#price' + Id).html(newprice)
            }
        }
    })

}

// adding new categorys

$("#addCategoryForm").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/admin/addCategory",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                swal("Category ", "success fully added New category!", "success")
            }
            if (response.exist) {
                swal("Category already exists!")
            }
        }
    });
});


$("#addAddressForm").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/addAddress",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                // redirect to checkout page---
                location.href = '/checkout';
            }
        }
    })

})
$("#placeOrderForm").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/placeOrder",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                location.href = '/placeOrder';
            }
        }
    })
})


