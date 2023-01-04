// modal opening querys


$(document).on("click", ".opendatamodal", function () {
    const selectionId = $(this).data('email');
    $(".modal-body .selection").val(selectionId);

});



function deleteProduct(id) {
    $(".delete-modal .proid").html(id);
}



function confirmDeleteProduct() {
    let id = $(".delete-modal .proid").html()
    $.ajax({
        url: '/admin/deleteProduct',
        method: 'post',
        data: {
            Id: id
        },
        success: (response) => {
            if (response.status) {
                location.reload()
            } else {
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

