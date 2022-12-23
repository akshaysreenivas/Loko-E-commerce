// signup validation    


const signupForm = document.getElementById('signupForm');
if(signupForm){
    signupForm.addEventListener("submit", validatesignup);
}


function validatesignup(e) {

 e.preventDefault(); 

const name = document.getElementById("signupname").value;
const email = document.getElementById("signupemail").value;
const password = document.getElementById("signuppassword").value;
const confirmPassword = document.getElementById("signupconfirmPassword").value;
const nameerr = document.getElementById("signameErr");
const emailerr = document.getElementById("signemailErr");
const passwordErr = document.getElementById("sigpasswordErr");
const confirmPasswordErr = document.getElementById("confpasswordErr");

    // const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;


  nameerr.innerHTML=""
  emailerr.innerHTML=""
  passwordErr.innerHTML=""
  confirmPasswordErr.innerHTML=""



console.log(name)
console.log(email)
console.log(password)
console.log(confirmPassword)


// ------name validation----

if(!name){
  nameerr.innerHTML=" * Name required "
  return
}
if(/\s/.test(name)){
  nameerr.innerHTML=" No  spaces "
  return
}
if(name.length<3){
  nameerr.innerHTML="Enter minimum 3 characters "
  return
}


// -------email validation-----

if(!email){
  emailerr.innerHTML=" * Email address required"
  return
}

const emailRegex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

if(!emailRegex.test(email)){
  emailerr.innerHTML=" Enter a valid email address"
  return
}


//-----Password validation----


if(!password){
  passwordErr.innerHTML=" * Password field required"
  return
}

if(/\s/.test(password)){
  passwordErr.innerHTML=" No  spaces "
  return
}


   const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (!passwordRegex.test(password)) {
    passwordErr.innerHTML="Password must contain between 6 and 16 characters long and contain at least one special character and a number "
    return;
  }

///-----Confirm password validation------

if(!confirmPassword){
  confirmPasswordErr.innerHTML=" * Confirm Password required"
  return
}

if(password!==confirmPassword){
  confirmPasswordErr.innerHTML="Passwords doesnt match"
return
}

  signupForm.submit();
}