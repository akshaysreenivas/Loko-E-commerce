const express = require("express");
const router = express.Router();
const userHelper = require("../helpers/userHelper");
const productHelper = require("../helpers/productHelper");

/* user home page. */

router.get("/", (req, res) => {

    productHelper.viewproducts().then((response) => {
      if (response) {
        const productsData = response.data
        res.render('users/home', { productsData,userName: req.session.username });
      }
    })
});

// --------user signup ---------

// get method

router.get("/signup", (req, res) => {
  if (req.session.loggedIn)
    res.redirect('/');
  else
    res.render("users/signup", { message: req.session.signinerr });
  req.session.signinerr = "";
});

// post method

router.post("/signup", (req, res) => {
  console.log(req.body)
  userHelper.userSignup(req.body).then((response) => {
    if (response.status) {
      res.redirect('/login')
    }
    else if (!response.status) {
      req.session.signinerr = "Looks like already have an account with this email! , login instead"
      res.redirect('/signup')

    }
    else {
      req.session.signinerr = "cannot signup database error"
      res.redirect('/signup')
    }
  });
});

// --------- user login---------

// get login

router.get("/login", (req, res) => {
  if (req.session.loggedIn)
    res.redirect('/');
  else {
    const message = req.session.message
    res.render("users/login", { message });
    req.session.message = " ";
  }
});

// post login

router.post("/login", (req, res) => {
  userHelper.dologin(req.body).then((response) => {
    if (!response.blocked) {
      if (response.user) {
        if (response.status) {
          req.session.user = response.result
          req.session.username=response.userdoc.name
          req.session.loggedIn = true
          res.redirect("/");
        }
        else {
          req.session.message = "Invalid Password"
          res.redirect("/login")
        }
      }
      else {
        req.session.message = "No User Found with this email id"
        res.redirect("/login")

      }
    }
    else if (response.blocked) {
      req.session.message = " OOPS !, Your account has been temporarly blocked"
      res.redirect("/login")

    }
  });

});


// =======logout=====

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
