const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const verifylogin = require('../middleware/loginverify');
const productmodel = require("../models/productmodel");

const mongoose=require("mongoose")







// --------------- user signup ----------------

// ------get method------

router.get("/signup",userController.signupPage)

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
          let user={
            name:response.userdoc.name,
            email:response.userdoc.email,
            _id:response.userdoc._id
          }
          req.session.user = user;
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
  let Categorys = null;
  let categorys=  await productController.viewCategory()
  if(categorys){
     Categorys= await categorys.Categorys
  }
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
        image: productsDatas.images[0].filename,
      };
    });  
    res.render("users/home", { productsData,Categorys, totalItems, user: req.session.user });
  });
});

// -------    viewproductsbycategory    ------

router.get('/categories/:category', productController.viewproductsbycategory)

// -----profile UI--------

router.get("/profile", verifylogin.verifyLogin,userController.viewProfile)
router.get("/orders",verifylogin.verifyLogin,userController.orderManage)
router.get("/address_book",verifylogin.verifyLogin,userController.manageAddress)
router.get('/coupons', verifylogin.verifyLogin, userController.viewCoupons)
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

router.get("/product/:productID",productController.getSingleproduct)


// cart --------

router.get("/cart", verifylogin.verifyLogin,userController.getCart)


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
  res.render('users/addAddress', { user: req.session.user})
})

router.post('/addAddress', verifylogin.verifyLogin, userController.addAddress)


// ------ place order -------

router.post('/create-checkout-session', verifylogin.verifyLogin, userController.cartPlaceOrder)

router.post('/applyCoupon', verifylogin.verifyLogin, userController.applyCoupon)
// confirm order  

router.get('/confirmOrder', verifylogin.verifyLogin,userController.orderConfirm)

router.get("/paymentfailed",verifylogin.verifyLogin,userController.paymentCancel)

router.post("/cancelOrder/:orderID",verifylogin.verifyLogin,userController.cancelOrder)

// ======logout====

router.get("/logout", userController.logout);

module.exports = router;
