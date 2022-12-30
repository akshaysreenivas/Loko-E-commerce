// modal opening querys

// $(document).ready(function() {
//     $('.side-a').addClass("active-btn");   

//     $(".side-a").on("click",function () {
//         $(".side-a").removeClass("active-btn");
//         $(this).addClass("active-btn");   
//     });
//     });




$(document).on("click", ".opendatamodal", function () {
    
    const selectionId = $(this).data('email');
    console.log(selectionId)

    $(".modal-body .selection").val(selectionId);

});

// $(document).on("click", "#opendatamodaldelete", function (e) {
//     e.preventDefault()
//     const Id = $(this).data('productId');
//     console.log(Id)
//     $('#dummy')
    
// });


function deleteProduct(id){

    $(".delete-modal .proid").html(id);
}
    


function confirmDeleteProduct(){
  let id= $(".delete-modal .proid").html()
    $.ajax({
        url:'/admin/deleteProduct',
        method:'post',
        data:{
            Id:id
        },
        success:(response)=>{
            if(response.status){
                location.reload()
            }else{
                alert('cannot delete product')
            }
        }
    })

}

// datatable

$(document).ready(function () {
    $('#userTable').DataTable();
    $('#productsTable').DataTable();
   
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

function addCount(Id, Count) {
    $.ajax({
        url: '/changeqty/',
        data: {
            id: Id,
            count: Count
        },
        method: 'post',
        success: (response) => {
            console.log("v",response.totalCost)
            let count = $('#' + Id).val()
            let amount = $('#price' + Id).html()
            let price = (amount/ count)
            count++
            let newprice=price*count
            $('#' + Id).val(count)
            $('#price' + Id).html(newprice)
            $('.totalcost' ).html(response.totalCost)
            $('.reduce-item-quantity' + Id).removeClass('disabled')
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
                let price = (totalprice/ count)
                count--
                if (count < 1) {
                    location.reload()
                    return
                }
                $('#' + Id).val(count)
                let newprice=price*count
                $('#' + Id).val(count)
                $('.totalcost' ).html(response.totalCost)

                $('#price' + Id).html(newprice)
            }
        }
    })

}





