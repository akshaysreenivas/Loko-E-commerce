const express = require("express");
const router = express.Router();
const userHelper = require("../helpers/userHelper");
const bcrypt = require("bcrypt");

/* user home page. */

router.get("/", (req, res) => {
  if(req.session.loggedIn)
 res.render('users/home');
 else
  res.redirect("/login");
});

// --------user signup ---------

// get method

router.get("/signup", (req, res) => {
  if(req.session.loggedIn)
 res.render('users/home');
 else
  res.render("users/signup",{message:req.session.signinerr});
  req.session.signinerr="";
});

// post method

router.post("/signup", (req, res) => {
  userHelper.userSignup(req.body).then((response) => {
    if (response.status) {
      console.log("success fully added user");
      res.redirect('login')
    }
    else if(!response.status){
      console.log("already have an account")
      req.session.signinerr="Looks like already have an account with this email! , login instead"
      res.redirect('/signup')

    }
    else {
      console.log("cannot signup database error ");
      res.redirect('/signup')
    }
  });
});

// --------- user login---------

// get login

router.get("/login", (req, res) => {
  if(req.session.loggedIn)
 res.render('users/home');
 else{
  const message = req.session.message
  res.render("users/login", { message });
  req.session.message = " ";
 }
 

});

router.post("/login", (req, res) => {
  userHelper.dologin(req.body).then((response) => {
    if(!response.blocked){
      if (response.user) {
        if (response.status) {
          req.session.message = "login successs"
          req.session.user=response.result
          req.session.loggedIn=true
          console.log(req.session.message);
          res.render("users/home");
        }
        else {
          req.session.message = "Invalid Password"
          console.log('invalid in db');
          res.redirect("/login")
        }
      }
      else {
        req.session.message = "No User Found with this email id"
        console.log('user dont exist in db');
        res.redirect("/login")
  
      }
    }
  else if(response.blocked){
    console.log('Your account has been blocked');
    req.session.message = "Your account has been temporarly blocked"
    res.redirect("/login")

  }
  });

});


router.post('logout',(req,res)=>{
 req.session.destroy()
 res.redirect('/login')
})

module.exports = router;
