const changePasswordForm=document.getElementById("changePasswordForm")
if(changePasswordForm)
changePasswordForm.addEventListener("submit",validatechangePasswordForm)

function validatechangePasswordForm(e){
    e.preventDefault()
    const password1=document.getElementById("password1").value
    const passwordErr=document.getElementById("passwordErr")
    const password2=document.getElementById("password2").value
    const confirmPasswordErr=document.getElementById("confpasswordErr")
    passwordErr.innerHTML = ""
    confirmPasswordErr.innerHTML = ""

    if (!password1) {
        console.log("nooo");
        passwordErr.innerHTML = " * Password field required"
        return
      }
    
      if (/\s/.test(password1)) {
        passwordErr.innerHTML = " No  spaces "
        return
      }
    
    
      const passwordregex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    
      if (!passwordregex.test(password1)) {
        passwordErr.innerHTML = "Password must contain between 6 and 16 characters long and contain at least one special character and a number "
        return;
      }
    
      ///-----Confirm password validation------
    
      if (!password2) {
        confirmPasswordErr.innerHTML = " * Confirm Password required"
        return
      }
    
      if (password1 !== password2) {
        confirmPasswordErr.innerHTML = "Passwords doesnt match"
        return
      }
      changePasswordForm.submit();

}