// modal opening querys

// $(document).ready(function() {
//     $(".side-a").on("click",function () {
//         $(".side-a").removeClass("active-btn");
//         $(this).addClass("active-btn");   
//     });
//     });




$(document).on("click", ".opendatamodal", function () {
    const selectionId = $(this).data('email');
    const Id = $(this).data('id');
    $(".modal-body .selection").val(selectionId);
    $(".modal-body .select").val(Id);

});

// datatable

$(document).ready(function () {
    $('#userTable').DataTable();
    $('#productsTable').DataTable();
    let count = $('reduce-item-quantity').val()
    count--
    if (count <= 1) {
        $('.reduce-item-quantity' + Id).addClass('disabled')
    }
});



//  show img in add product

$(document).ready(function () {
    $('#addedImg').hide();
    $(".spinner-border").removeClass("spinner-border");
})

function viewImg(event) {
    const addImg = document.getElementById('addedImg')
    $('#addedImg').show();
    addImg.src = URL.createObjectURL(event.target.files[0])
}

//  show new img in edit product


function newImgView(event) {
    document.getElementById('newImg').src = URL.createObjectURL(event.target.files[0])
}

// ajax for cart

// addtocart

function addToCart(Id) {
    $("#add-to-cart-text"+Id).addClass("d-none");
    $("#add-to-cart-spinner"+Id).addClass("spinner-border");
    $.ajax({
        url: '/addToCart/'+Id,
        method: 'post',
        data:{
productid:Id
        },
        success: (response) => {
            let count = response.itemCount.totalQty;
            $('#cart-count').html(count)
            $("#add-to-cart-text"+Id).removeClass("d-none");
            $(".spinner-border").removeClass("spinner-border");
        }
    })

}

// delete from cart 

function deleteCartProduct(Id) {
    $.ajax({
        url: '/delete-cart-item/' + Id,
       
        method: "post",
        success: (response) => {
            // console.log("response",response);
            // let count = $('#cart-count').html().val - 1
            // $('#cart-count').html(count)
            // $('#single-cart-item'+Id).addClass("d-none")
            location.reload()
        }
    })
}



// change single item quantity 

function addCount(Id,Count) {
    $.ajax({
        url: '/changeqty/',
        data:{
            id:Id,
            count:Count
         },
        method: 'post',
        success: (response) => {
            let count = $('#' + Id).val()
            count++
            $('#' + Id).val(count)
            $('.reduce-item-quantity' + Id).removeClass('disabled')
        }
    })
}





function decCount(Id,Count) {
    $.ajax({
        url: '/changeqty/',
        data:{
            id:Id,
            count:Count
         },
        method: 'post',
        success: (response) => {
            if (response) {
                let count = $('#' + Id).val()
                count--
                if (count <= 1) {
                    $('.reduce-item-quantity' + Id).addClass('disabled')
                }
                $('#' + Id).val(count)
            }
        }
    })

}





