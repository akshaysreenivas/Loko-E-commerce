// modal opening querys

$(document).on("click", ".opendatamodal", function () {
    const selectionId = $(this).data('email');
    const Id = $(this).data('id');
    $(".modal-body .selection").val( selectionId );
    $(".modal-body .select").val( Id );

});

// datatable

$(document).ready( function () {
    $('#userTable').DataTable();
    $('#productsTable').DataTable();
} );



//  show img in add product

$(document).ready(function(){
    document.getElementById('addedImg').style.display='none'

})

function viewImg(event){
    const addImg=document.getElementById('addedImg')
    addImg.style.display='block'
    addImg.src=URL.createObjectURL(event.target.files[0])
}

//  show new img in edit product


function newImgView(event){
document.getElementById('newImg').src=URL.createObjectURL(event.target.files[0])
}





