// ajax for cart



// addtocart

function addToCart(Id) {
    $("#add-to-cart-text" + Id).addClass("d-none");
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
            swal("Good job!", "You clicked the button!", "success");
        }
    })

}

// delete from cart 

function deleteCartProduct(Id) {
    $.ajax({
        url: '/delete-cart-item/' + Id,
        method: "post",
        success:async (response) => {
            location.reload()

                swal("hello")
        }
    })
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
                if (count < 1) {
                    location.reload()
                    return
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





