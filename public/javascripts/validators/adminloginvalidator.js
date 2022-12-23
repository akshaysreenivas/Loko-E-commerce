// admin login form validation   

const adminloginForm = document.getElementById("adminForm");
if(adminloginForm){
 adminloginForm.addEventListener("submit", validateadminLogin);
}


function validateadminLogin(e){
 e.preventDefault()
const password=document.getElementById("adpassword").value
const email = document.getElementById("ademail").value;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const emailerr = document.getElementById("admemailerr");
const passworderr =document.getElementById("admpasserr")
    emailerr.innerHTML=""
    passworderr.innerHTML=""


//---Email validation----

if(!email){
    if(emailerr){
        emailerr.innerHTML="* Email address required"
    }
  return
}


if (/\s/.test(email)) {
    if(emailerr){
        emailerr.innerHTML=" No spaces"
    }
  return
}

if(!emailRegex.test(email)){
    if(emailerr){
        emailerr.innerHTML="Enter a valid Email address"
    }
  return
}


// -----password validation-----

if(!password){
    if(passworderr){
        passworderr.innerHTML="* Password required"
    }
  return
  }

if (/\s/.test(password)) {
    if(passworderr){
        passworderr.innerHTML="No spaces"
    }
  return
}

if(password.trim().length<6){
    if(passworderr){
        passworderr.innerHTML="Enter a minimum 6 to maximum 18 characters"
    }
return
}
if(password.length<6){
    if(passworderr){
        passworderr.innerHTML="Enter a minimum 6 to maximum 18 characters"
    }  return
} 


adminloginForm.submit()
}