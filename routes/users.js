const express = require("express");
const router = express.Router();
const userHelper = require("../helpers/userHelper");
const productHelper = require("../helpers/productHelper");

/* user home page. */

router.get("/", async(req, res) => { 
   await productHelper.viewproducts().then((response) => {
      const productsData = response.data;
      res.render("users/home", { productsData, user: req.session.user });
    });
 
});

// --------user signup ---------

// get method

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) res.redirect("/");
  else res.render("users/signup", { message: req.session.signinerr });
  req.session.signinerr = "";
});

// post method

router.post("/signup", (req, res) => {
  userHelper.userSignup(req.body).then((response) => {
    if (response.status) {
      res.redirect("/login");
    } else if (!response.status) {
      req.session.signinerr =
        "Looks like already have an account with this email! , login instead";
      res.redirect("/signup");
    } else {
      req.session.signinerr = "cannot signup database error";
      res.redirect("/signup");
    }
  });
});

// --------- user login---------

// get login

router.get("/login", (req, res) => {
  if (req.session.loggedIn) res.redirect("/");
  else {
    const message = req.session.message;
    res.render("users/login", { message });
    req.session.message = " ";
  }
});

// post login

router.post("/login", (req, res) => {
  userHelper.dologin(req.body).then((response) => {
    if (!response.user) {
      req.session.message = "No User Found with this email id";
      res.redirect("/login");
    } else {
      if (response.blocked) {
        req.session.message =
          " OOPS !, Your account has been temporarly blocked";
        res.redirect("/login");
      } else {
        if (response.result) {
          req.session.user = response.userdoc;
          req.session.loggedIn = true;
          res.redirect("/");
        } else {
          req.session.message = "Invalid Password";
          res.redirect("/login");
        }
      }
    }
  });
});

// profile UI--------

router.get("/profile", (req, res) => {
  // if (req.session.loggedIn) 
  res.render("users/profile",{ user : req.session.user });
  // else redirect("/login");
});


// cart --------

router.get("/cart", (req, res) => {
  if (req.session.loggedIn){
userHelper.getCartItems(req.session.user._id)
    res.render("users/cart",{ user : req.session.user });
  }
  else
  res.redirect("/login");
});
router.post("/addToCart/:productID", (req, res) => {

  if (req.session.loggedIn){
    const quantity=1;
    userHelper.addToCart(req.session.user._id,req.params.productID,quantity)
    res.redirect("/cart");

  }
  else
  res.redirect("/login");
});

// product view ------ 

router.get("/product/:productID", async(req, res) => {
   const product = await productHelper.getproduct(req.params.productID)
   res.render("users/product",{ user : req.session.user , product:product.data});
 
});

// wishlist -------

router.get("/wishlist", (req, res) => {
  if (req.session.loggedIn) res.render("users/wishlist",{ user : req.session.user });
  else redirect("/login");
});

// =======logout=====

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
