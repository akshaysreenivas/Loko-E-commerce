

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


// <!----------edit product---------->


$(document).ready(function () {
    $("#editProduct").submit(function (event) {
        event.preventDefault();
        let formData = new FormData();
        let id = $("#filename").val()
        console.log(id)
        let image = $("#image" + id)[0].files[0];
        formData.append("categoryimage", image);
        formData.append("category", $("#category").val());
        // $.ajax({
        //     url: "/admin/editproduct",
        //     method: "POST",
        //     data: formData,
        //     processData: false,
        //     contentType: false,
        //     success: function (response) {
        //         if (response.status) {
        //             location.reload()
        //         }
        //         if (response.exists) {
        //             swal("Category already exists");
        //         }
        //     },
        //     error: function (error) {
        //         swal("Failed!", error, "error");
        //     }
        // });
    });
});




// ------- delete category-------
function deleteCategory(Id, image) {
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
                    url: '/admin/deleteCategory/' + Id + '/' + image,
                    method: "POST",
                    success: (response) => {
                        if (response.status)
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
//----adding address from checkout page----
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
//----adding address from profile page----

$("#addAddress").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/addAddress",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                swal("Added!", "Address Added Successfully!", "success");
                location.reload()
            }
        }
    })

})
// ------ edit address ----
$("#editAddress").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/editaddress",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                swal("Done!", "Address Edited Successfully!", "success");
            } else {
                swal("Failed!", error, "error");

            }
        }
    })

})

//------------edit profile details----------

// ---------change name------

const nameSubmitButton = document.getElementById("nameSubmitButton");
const myInputname = document.getElementById("myInputname");
const toggleButton = document.getElementById("toggleButton")
// toggle the submit button and the text of the button when the input field is toggled
if (toggleButton) {
    toggleButton.addEventListener("click", function () {
        if (myInputname.hasAttribute("readonly")) {
            myInputname.removeAttribute("readonly");
            nameSubmitButton.style.display = "block";
            toggleButton.innerText = "cancel";
        } else {
            myInputname.setAttribute("readonly", true);
            toggleButton.innerText = "Edit";
            nameSubmitButton.style.display = "none";
        }
    });
}

$("#changeName").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/changeName",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                swal({
                    title: "Done!",
                    text: "Edited Name Successfully",
                    icon: "success",
                    dangerMode: false,
                })
                    .then(() => {
                        location.reload()
                    });
            } else {
                swal("Failed!", error, "error");

            }
        }
    })
})


// ---------change email------

const emailSubmitButton = document.getElementById("emailSubmitButton");
const inputEmail = document.getElementById("myInputemail");
const toggleBtn = document.getElementById("toggleBtn")
// toggle the submit button and the text of the button when the input field is toggled
if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
        if (inputEmail.hasAttribute("readonly")) {
            inputEmail.removeAttribute("readonly");
            emailSubmitButton.style.display = "block";
            toggleBtn.innerText = "cancel";
        } else {
            inputEmail.setAttribute("readonly", true);
            toggleBtn.innerText = "Edit";
            emailSubmitButton.style.display = "none";
        }
    });
}




$("#changeEmail").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/changeEmail",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                swal({
                    title: "Done!",
                    text: "Edited Email Successfully",
                    icon: "success",
                    dangerMode: false,
                })
                    .then(() => {
                        location.reload()
                    });
            } else {
                swal("Failed!", error, "error");

            }
        }
    })
})



$("#changePassword").submit(function (e) {
    let spinner = document.getElementById("spinner_password")
    let btn = document.getElementById("btn_submit")
    spinner.style.display = "block";
    btn.style.display = "none";
    e.preventDefault();
    $.ajax({
        url: "/generate_otp_changeuserdetails",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                location.href = '/changeuserdetailsOtp';

            } else {
                swal("Failed!", error, "error");

            }
        }
    })

})

// --------placeOrder Form---------

$("#placeOrderForm").submit(function (e) {
    e.preventDefault();

    $(':input[type="submit"]').prop('disabled', true);
    let spinner = document.getElementById("spinner_checkout")
    let submit = document.getElementById("btn_submit")
    if(spinner)
    spinner.style.display = "block";
    if(submit)
    submit.style.display = "none";
    e.preventDefault();
    $.ajax({
        url: "/create-checkout-session",
        method: "POST",
        dataType: "json",
        data: $(this).serialize(),
        success: function (response) {
            if (response.status) {
                if (response.url)
                    location.href = response.url;
                else
                    location.href = '/placeOrder';
            }
        }
    })


})



// profile management ------

function deleteaddress(id) {
    swal({
        title: "Are you sure?",
        text: "Delete this address",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/deleteAddress',
                    method: 'post',
                    data: {
                        Id: id
                    },
                    success: (response) => {
                        if (response.status) {
                            location.reload()
                        }
                    }
                })
            }
        });

}



function deleteaddress(id) {
    swal({
        title: "Are you sure?",
        text: "Delete this address",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/deleteAddress',
                    method: 'post',
                    data: {
                        Id: id
                    },
                    success: (response) => {
                        if (response.status) {
                            location.reload()
                        }
                    }
                })
            }
        });

}