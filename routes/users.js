const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const verifylogin = require('../middleware/loginverify')


// --------user signup ---------

// ------get method------

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) res.redirect("/");
  else res.render("users/signup");
});


router.get('/otp-validation', (req, res) => {
  if (req.session.loggedIn) res.redirect("/");
  else{
    res.render('users/otp',{invalidOtp:req.session.invalidOtp})
    req.session.invalidOtp=""
  }
})
// ------post method------

router.post("/signup", userController.userSignup)

//----------- user validation with otp  ---------

router.post("/otp-validation", userController.otpValidator)



// --------- user login---------

// get login

router.get("/login", (req, res) => {
  if (req.session.loggedIn)
    res.redirect("/");
  else {
    const message = req.session.message;
    res.render("users/login", { message });
    req.session.message = " ";
  }
});

// post login

router.post("/login", (req, res) => {
  userController.dologin(req.body).then((response) => {
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

/* user home page. */

router.get("/", async (req, res) => {
  let totalItems = null;
  if (req.session.user) {
    totalItems = await userController.getCartCount(req.session.user._id);
  }
  await productController.viewproducts().then((response) => {
    const productsData = response.data;

    res.render("users/home", { productsData, totalItems, user: req.session.user });
  });
});

// profile UI--------

router.get("/profile", verifylogin.verifyLogin, (req, res) => {
  res.render("users/profile", { user: req.session.user });
});

// product view ------

router.get("/product/:productID", async (req, res) => {
  const product = await productController.getproduct(req.params.productID);
  res.render("users/product", {
    user: req.session.user,
    product: product.data,
  });
});

// cart --------

router.get("/cart", verifylogin.verifyLogin, async (req, res) => {

  let totalCost = 0;
  await userController.getCartTotalamount(req.session.user._id).then((response) => {
    if (response.status) {
      totalCost = response.totalAmount[0].totalCost
    }
  })
  await userController.getCartItems(req.session.user._id).then((response) => {
    let totalItems = 0;
    let cartProducts = null;
    if (response.status) {
      totalItems = response.cartItems[0].totalQty;
      cartProducts = response.cartItems;
    }
    res.render("users/cart", { cartProducts, totalCost, totalItems, user: req.session.user });
  });
});

// post 

router.post("/addToCart/:productID", verifylogin.verifyLogin, async (req, res, next) => {
  const quantity = 1;
  await userController
    .addToCart(req.session.user._id, req.params.productID, quantity)
    .then((response) => {
      let itemCount = response.data;
      res.json({ itemCount });
    })
    .catch((err) => err);
});


// delete product from cart 

router.post("/delete-cart-item/:productID", verifylogin.verifyLogin, (req, res) => {
  let count = -1;
  userController
    .deleteCartProduct(req.session.user._id, req.params.productID, count)
    .then((response) => {
      res.json({ response });
    });
});

// change quantity of a single item in cart  

router.post("/changeqty", verifylogin.verifyLogin, async (req, res) => {
  let totalCost = 0;
  await userController
    .changeCartProductCount(req.session.user._id, req.body)
    .then((response) => {
      userController.getCartTotalamount(req.session.user._id).then((response) => {
        totalCost = response.totalAmount[0].totalCost
        res.json({ totalCost });
      })
    });
});



// checkout page -------


router.get('/checkout', (req, res) => {
  res.render('users/checkout')
})

// wishlist -------


// =======logout=====

router.get("/logout", userController.logout);

module.exports = router;
