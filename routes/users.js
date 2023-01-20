const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const verifylogin = require('../middleware/loginverify');


// --------------- user signup ----------------

// ------get method------

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) res.redirect("/");
  else res.render("users/signup");
});

// ------post method------

router.post("/signup", userController.userSignup)

//--- user validation with otp  -----

router.get('/otp-validation', (req, res) => {
  if (req.session.loggedIn) res.redirect("/");
  else {
    res.render('users/otp', { invalidOtp: req.session.invalidOtp })
    req.session.invalidOtp = ""
  }
})

router.post("/otp-validation", userController.otpValidator)

// --------------- user login ----------------

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
    const productsDatas = response.data;
    const productsData = productsDatas.map((productsDatas) => {
      return {
        _id: productsDatas._id,
        name: productsDatas.name,
        price: productsDatas.price,
        image: productsDatas.images[0].data
      };
    });
    res.render("users/home", { productsData, totalItems, user: req.session.user });
  });
});

// router.get("/",(req,res)=>{
//   res.render('users/onlinePayment')
// })
router.get("/success",(req,res)=>{
  res.render('users/invoice')
})
router.get("/cancel",(req,res)=>{
  res.json({failed:"failed"})
})









// -------    viewproductsbycategory    ------

router.get('/categories/:category', productController.viewproductsbycategory)




// -----profile UI--------

router.get("/profile", verifylogin.verifyLogin,userController.viewProfile)
router.get("/orders",verifylogin.verifyLogin,userController.orderManage)
router.get("/profile_manage",verifylogin.verifyLogin,userController.manageProfile)
router.get("/address_book",verifylogin.verifyLogin,userController.manageAddress)
router.get('/profile/editaddress/:addressid', verifylogin.verifyLogin, userController.addressTobeEdited)
router.get('/changeuserdetailsOtp', verifylogin.verifyLogin, userController.otpPage)


router.post('/generate_otp_changeuserdetails',verifylogin.verifyLogin,userController.otpGeneration)
router.post('/submit_otp_changePassword',verifylogin.verifyLogin,userController.otpVerification)
router.post('/changePassword',verifylogin.verifyLogin,userController.changePassword)
router.post('/changeEmail',verifylogin.verifyLogin,userController.changeEmail)
router.post('/addAddress', verifylogin.verifyLogin, userController.addAddress)
router.post('/editaddress', verifylogin.verifyLogin, userController.editAddress)
router.post('/deleteAddress',verifylogin.verifyLogin,userController.deleteAddress)

router.post('/changeName',verifylogin.verifyLogin,userController.changeName)

// product view ------

router.get("/product/:productID", async (req, res) => {
  let productimage;
  let product = await productController.getproduct(req.params.productID);
  if (product) {
    productimage = product.data.images[0].data
  }
  res.render("users/product", { user: req.session.user, product: product.data, productimage });
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

router.post("/delete-cart-item/:productID", verifylogin.verifyLogin, userController.deleteCartProduct);


// change quantity of a single item in cart  

router.post("/changeqty", verifylogin.verifyLogin, async (req, res) => {
  let totalCost = 0;
  await userController
    .changeCartProductCount(req.session.user._id, req.body)
    .then((response) => {
      userController.getCartTotalamount(req.session.user._id).then((response) => {
        if (response.totalAmount) {
          totalCost = response.totalAmount[0].totalCost
          res.json({ totalCost });
        }
        else {
          res.json({ removed: true });

        }
      })
    });
});



// checkout page -------
router.get('/checkout', verifylogin.verifyLogin, userController.viewCheckout)

// ------add new address------

router.get('/addAddress', verifylogin.verifyLogin, (req, res) => {
  res.render('users/addaddress', { user: req.session.user })
})

router.post('/addAddress', verifylogin.verifyLogin, userController.addAddress)


// ------ place order -------

router.post('/create-checkout-session', verifylogin.verifyLogin, userController.cartPlaceOrder)


// confirm order  

router.get('/placeOrder', verifylogin.verifyLogin, (req, res) => {
  res.render('users/orderConfirm', { user: req.session.user })
})




// =======logout=====

router.get("/logout", userController.logout);

module.exports = router;
