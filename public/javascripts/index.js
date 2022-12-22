$(document).on("click", ".opendatamodal", function () {
    const selectionId = $(this).data('email');
    const Id = $(this).data('id');
    console.log(selectionId)
    console.log(Id)
    $(".modal-body .selection").val( selectionId );
    $(".modal-body .select").val( Id );

});