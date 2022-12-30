const express = require("express");
const router = express.Router();
const userHelper = require("../helpers/userHelper");
const productHelper = require("../helpers/productHelper");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* user home page. */

router.get("/", async (req, res) => {
  let totalItems = null;
  if (req.session.user) {
    totalItems = await userHelper.getCartCount(req.session.user._id);
  }
  await productHelper.viewproducts().then((response) => {
    const productsData = response.data;

    res.render("users/home", { productsData, totalItems, user: req.session.user });
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

router.get("/profile", verifyLogin, (req, res) => {
  res.render("users/profile", { user: req.session.user });
});

// product view ------

router.get("/product/:productID", async (req, res) => {
  const product = await productHelper.getproduct(req.params.productID);
  res.render("users/product", {
    user: req.session.user,
    product: product.data,
  });
});

// cart --------

router.get("/cart", verifyLogin, async (req, res) => {

  let totalCost = 0;
  await userHelper.getCartTotalamount(req.session.user._id).then((response) => {
    totalCost = response.totalAmount[0].totalCost

  })

  await userHelper.getCartItems(req.session.user._id).then((response) => {
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

router.post("/addToCart/:productID", verifyLogin, async (req, res, next) => {
  const quantity = 1;
  await userHelper
    .addToCart(req.session.user._id, req.params.productID, quantity)
    .then((response) => {
      let itemCount = response.data;
      res.json({ itemCount });
    })
    .catch((err) => err);
});


// delete product from cart 

router.post("/delete-cart-item/:productID", verifyLogin, (req, res) => {
  let count = -1;
  userHelper
    .deleteCartProduct(req.session.user._id, req.params.productID, count)
    .then((response) => {
      res.json({ response });
    });
});

// change quantity of a single item in cart  

router.post("/changeqty", verifyLogin, async (req, res) => {
  let totalCost = 0;
  await userHelper
    .changeCartProductCount(req.session.user._id, req.body)
    .then((response) => {
      userHelper.getCartTotalamount(req.session.user._id).then((response) => {
        totalCost = response.totalAmount[0].totalCost
        res.json({ totalCost });
      })
    });
});

// wishlist -------

router.get("/wishlist", verifyLogin, (req, res) => {
  res.render("users/wishlist", { user: req.session.user });
});

// =======logout=====

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
