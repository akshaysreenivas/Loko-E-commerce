const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productHelper = require("../controllers/productController");
const verifylogin = require('../middleware/loginverify')

/* GET home page. */



router.get("/", verifylogin.verifyadminlogin, function (req, res, next) {
  res.redirect("admin/listProducts");
});

// ---------admin login---------

// get method
router.get("/login", function (req, res, next) {
  if (req.session.adminloggedIn)
    res.redirect("/admin");
  else {
    res.render("admin/login", { message: req.session.message });
    req.session.message = "";
  }
});

// post method

router.post("/adminlogin", (req, res) => {
  adminController.adminLogin(req.body).then((response) => {
    if (response.admin) {
      if (response.status) {
        req.session.adminloggedIn = true;
        res.redirect("/admin");
      } else {
        req.session.message = "invalid password";
        res.redirect("/admin/login");
      }
    } else {
      req.session.message = "You are not authorised to accesss";
      res.redirect("/admin/login");
    }
  });
});



// =========Product Management=======

// router.post("/addCategory",productHelper.addCategorys)

// -------Add Product------

router.post("/add-product", verifylogin.verifyadminlogin, (req, res) => {
  productHelper.addProduct(req.body).then((response) => {
    const imgid = response.data._id;
    const image = req.files.image;
    image.mv(`./public/images/product-images/${imgid}.jpg`, (err) => {
      if (!err) {
        req.session.addedProduct = true;
        res.redirect("/admin/addproduct");
        req.session.addedProduct = false;
      } else {
        res.send("404 error failed uploading data");
      }
    });
  });
});

router.get("/addproduct", verifylogin.verifyadminlogin, function (req, res, next) {
  res.render("admin/addProduct", { done: req.session.addedProduct });
});

// -------Edit Product------

router.get("/editProduct/:userId", verifylogin.verifyadminlogin, (req, res) => {
  productHelper.getproduct(req.params.userId).then((response) => {
    if (response.status) {
      res.render("admin/editProduct", { tobeupdate: response.data });
    }
    else
      res.send("fail");
  });
});

router.post("/editproduct", verifylogin.verifyadminlogin, function (req, res, next) {
  productHelper.editproduct(req.body).then((response) => {
    if (response.status) {
      res.redirect("/admin/listproducts");
    } else res.send("error");
  });
});

// ===== List Products =====

router.get("/listproducts", verifylogin.verifyadminlogin, function (req, res, next) {
  productHelper.viewproducts().then((response) => {
    if (response) {
      const productsData = response.data;
      res.render("admin/listProducts", { productsData });
    }
  });
});

// -------Delete Product------

router.post("/deleteProduct", verifylogin.verifyadminlogin, (req, res) => {
  productHelper.deleteProduct(req.body).then((response) => {
    res.json(response);
  });
});




// ===========User Management========



// =====List Users=====

router.get("/listusers", verifylogin.verifyadminlogin, function (req, res, next) {
  adminController.getusersData().then((response) => {
    if (response.status) {
      res.render("admin/listUsers", { usersData: response.usersdata });
    } else {
      res.send(err);
    }
  });
});

// =========block users=====

router.post("/blockUser", verifylogin.verifyadminlogin, (req, res) => {
  adminController.blockUser(req.body).then(() => {

    res.redirect("/admin/listusers");


  });
});

/// =======Unblock user =======

router.post("/unBlockUser", verifylogin.verifyadminlogin, (req, res) => {
  adminController.unBlockUser(req.body).then(() => {
    res.redirect("/admin/listusers");
  });
});

// --------logout--------

router.get("/logout",adminController.logout);

module.exports = router;
