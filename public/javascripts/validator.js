
////////validateForm

  const usersignupForm = document.getElementById("signupForm");
  const userloginForm = document.getElementById("userLoginForm");
  const adminloginForm = document.getElementById("adminLoginForm");
  const passwordErr = document.getElementById("passwordErr");
  const emailerr =document.getElementById("emailerr")

// regex    
// const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
// const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  

  // usersignupForm.addEventListener("submit", validatesignup);
  userloginForm.addEventListener("submit", validateLogin);
  // adminloginForm.addEventListener("submit", validateForm);

  function validatesignup(e) {
    alert("hello")
    e.preventDefault(); // prevent the form from being submitted
    emailerr.innerHTML="Enter a valid emailaddress "
    passwordErr.innerHTML="Enter minimum 6 characters "

    // const name = document.getElementById("signupname").value;
    const email = document.getElementById("signupemail").value;
    const password = document.getElementById("signuppassword").value;
    // const confirmPassword = document.getElementById("signupconfirmPassword").value;
console.log(name)
console.log(email)
console.log(password)
console.log(confirmPassword)

//     // validate the name field
    // if (name.length < 3) {
    //   alert("Name must be at least 3 characters long.");
    //   return;
    // }

//     // validate the email field
//     var emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
//     if (!emailRegex.test(email)) {
//       alert("Email must be in a valid format.")
//       return
//     }

    // // validate the password field
    // var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   alert("Password must be at least 8 characters long and contain at least one special character.");
    //   return;
    // }

    // // validate the confirm password field
    // if (password !== confirmPassword) {
    //   alert("Confirm password must match password.");
    //   return;
    // }

    // all input values are valid, submit the form
    // form.submit();
  }

function validateLogin(e){
  e.preventDefault()
const password=document.getElementById("userPassword").value
const email = document.getElementById("userEmail").value;

emailerr.innerHTML=""
passwordErr.innerHTML=""

if(!emailRegex.test(email)){
  emailerr.innerHTML="Enter a valid Email address"
  return
}
if(password.length<6){
  passwordErr.innerHTML="Enter a minimum 6 to maximum 18 characters"
  return
}
userloginForm.submit()
}








