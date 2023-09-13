// user login form validation     

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", validateuserLogin);
}

function validateuserLogin(e) {
  e.preventDefault()
  const password = document.getElementById("userPassword").value
  const email = document.getElementById("userEmail").value;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordErr = document.getElementById("passwordErr");
  const emailerr = document.getElementById("emailerr")
  emailerr.innerHTML = ""
  passwordErr.innerHTML = ""



  //---Email validation----

  if (!email) {
    if (emailerr) {
      emailerr.innerHTML = "* Email address required"
    }
    return
  }

  if (/\s/.test(email)) {
    emailerr.innerHTML = " No white spaces"
    return
  }

  if (!emailRegex.test(email)) {
    emailerr.innerHTML = "Enter a valid Email address"
    return
  }



  // -----password validation-----

  if (!password) {
    if (passwordErr) {
      passwordErr.innerHTML = "* Password required"
    }
    return
  }



  loginForm.submit()
}
