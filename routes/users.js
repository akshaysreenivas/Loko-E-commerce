const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const verifylogin = require('../middleware/loginverify');


// ------- user login ------
//  login page
router.get("/login", userController.loginPage)

// post login
router.post("/login", userController.login)

// user signup page ----------------
router.get("/signup", userController.signupPage)

// ------post method------
router.post("/signup", userController.userSignup)

// otp page   
router.get('/otp-validation', userController.loginOtpPage)

//--- user validation with otp  -----
router.post("/otp-validation", userController.otpValidator)

// user home page
router.get("/", userController.homePage)

// Shop page  
router.get('/shop', userController.shopPage)

// blog page  
router.get('/blog', userController.blogPage)

// contacts page  
router.get('/contact', userController.contactPage)

// about page  
router.get('/about', userController.aboutPage)


// -----profile UI--------

router.get("/profile", verifylogin.verifyLogin, userController.viewProfile)
router.get("/orders", verifylogin.verifyLogin, userController.orderManage)
router.get("/address_book", verifylogin.verifyLogin, userController.manageAddress)
router.get('/coupons', verifylogin.verifyLogin, userController.viewCoupons)
router.get('/profile/editaddress/:addressid', verifylogin.verifyLogin, userController.addressTobeEdited)
router.get('/changeuserdetailsOtp', verifylogin.verifyLogin, userController.otpPage)


router.post('/generate_otp_changeuserdetails', verifylogin.verifyLogin, userController.otpGeneration)
router.post('/submit_otp_changePassword', verifylogin.verifyLogin, userController.otpVerification)
router.post('/changePassword', verifylogin.verifyLogin, userController.changePassword)
router.post('/changeEmail', verifylogin.verifyLogin, userController.changeEmail)
router.post('/addAddress', verifylogin.verifyLogin, userController.addAddress)
router.post('/editaddress', verifylogin.verifyLogin, userController.editAddress)
router.post('/deleteAddress', verifylogin.verifyLogin, userController.deleteAddress)
router.post('/changeName', verifylogin.verifyLogin, userController.changeName)

// product view ------
router.get("/product/:productID", productController.getSingleproduct)

// -------    viewproductsbycategory    ------
router.get('/categories/:category', productController.viewproductsbycategory)

// cart --------
router.get("/cart", verifylogin.verifyLogin, userController.getCart)

// add to cart  
router.post("/addToCart/:productID", verifylogin.verifyLogin, userController.addToCartlist)

// delete product from cart 
router.post("/delete-cart-item/:productID", verifylogin.verifyLogin, userController.deleteCartProduct);

// change quantity of a single item in cart  
router.post("/changeqty", verifylogin.verifyLogin, userController.changeqty);

// wishlist page  
router.get("/wishlist", verifylogin.verifyLogin, userController.getWishlist)

// add to wishlist  
router.post("/addToWishlist/:productID", verifylogin.verifyLogin, userController.addToWishlist)

// move to wishlist   
router.post("/moveToWishlist/:productID", verifylogin.verifyLogin, userController.moveToWishlist)

// ----- checkout page -------
router.get('/checkout', verifylogin.verifyLogin, userController.viewCheckout)

// add address page    
router.get('/addAddress', verifylogin.verifyLogin, userController.addAddressPage)

// ------add new address------
router.post('/addAddress', verifylogin.verifyLogin, userController.addAddress)

// ------ place order -------
router.post('/create-checkout-session', verifylogin.verifyLogin, userController.cartPlaceOrder)

// coupon apply 
router.post('/applyCoupon', verifylogin.verifyLogin, userController.applyCoupon)

// confirm order  
router.get('/confirmOrder', verifylogin.verifyLogin, userController.orderConfirm)

// payment failed page  
router.get("/paymentfailed", verifylogin.verifyLogin, userController.paymentCancel)

// cancel order  
router.post("/cancelOrder/:orderID", verifylogin.verifyLogin, userController.cancelOrder)

// ======logout====
router.get("/logout", userController.logout);

module.exports = router;
