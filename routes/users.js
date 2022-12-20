const express = require("express");
const router = express.Router();
const userHelper = require("../helpers/userHelper");
const bcrypt = require("bcrypt");

/* user home page. */

router.get("/", (req, res) => {
  res.render("users/signup");
});

// --------user signup ---------

// get method

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// post method

router.post("/signup", (req, res) => {
  userHelper.userSignup(req.body).then((response) => {
    console.log(response.data.name);
    if (response.status) {
      console.log("success fully added user");
      res.redirect('login')
    } else {
      console.log("cannot signup database error ");
      res.redirect('/signup')
    }
  });
});

// --------- user login---------

// get login

router.get("/login", (req, res) => {
  let message=req.session.message
  res.render("users/login",{message});
  req.session.message=" ";

});

router.post("/login", (req, res) => {
  userHelper.dologin(req.body).then((response) => {
    if (response.user) {
      if (response.status) {
        req.session.message="login successs"
        console.log(req.session.message);
        res.render("users/home");
      }
      else {
        req.session.message="Invalid Password"
        console.log('invalid in db');
        res.redirect("/login")
      }
    }
    else {
      req.session.message="No User Found with this email id"

      console.log('user dont exist in db');
      res.redirect("/login")

    }
  });

});

module.exports = router;
