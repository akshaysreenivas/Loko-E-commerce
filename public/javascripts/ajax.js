

// --------adding new categorys---------


$(document).ready(function () {
    $("#addCategoryForm").submit(function (event) {
        event.preventDefault();
        let formData = new FormData();
        let image = $("#image")[0].files[0];
        formData.append("categoryimage", image);
        formData.append("category", $("#category").val());
        $.ajax({
            url: "/admin/addCategory",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    location.reload()
                }
                if (response.exists) {
                    swal("Category already exists");
                }
            },
            error: function (error) {
                swal("Failed!", error, "error");
            }
        });
    });
});




// ------- delete category-------
function deleteCategory(Id,image ){ 
    swal({
        title: "Are you sure?",
        text: "Delete this category",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/admin/deleteCategory/'+Id+'/'+image,
                    method: "POST",
                    success: (response) => {
                        if(response.status)
                        location.reload()
                        else
                        swal("Failed!", error, "error");

                    }
                })
            }
        });


}


// -------ajax for cart-------
// addtocart

function addToCart(Id) {
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

// --------Address Form---------

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

// --------placeOrder Form---------

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



