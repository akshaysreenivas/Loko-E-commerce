const express = require("express");
const router = express.Router();
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");

/* GET home page. */

router.get("/", function (req, res, next) {
  if (req.session.adminloggedIn) {
    res.redirect("admin/listProducts");
  } else res.redirect("/admin/login");
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
  adminHelper.adminLogin(req.body).then((response) => {
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



// -------Add Product------

router.post("/add-product", (req, res) => {
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

router.get("/addproduct", function (req, res, next) {
  if (req.session.adminloggedIn) {
    res.render("admin/addProduct", { done: req.session.addedProduct });
  } else res.redirect("/admin/login");
});

// -------Edit Product------

router.get("/editProduct/:userId", (req, res) => {
  if (req.session.adminloggedIn) {
    productHelper.getproduct(req.params.userId).then((response) => {
      if (response.status) {
        res.render("admin/editProduct", { tobeupdate: response.data });
      }
       else
        res.send("fail");
    });
  } else res.redirect("/admin/login");
});

router.post("/editproduct", function (req, res, next) {
  productHelper.editproduct(req.body).then((response) => {
    if (response.status) {
      res.redirect("/admin/listproducts");
    } else res.send("error");
  });
});

// ===== List Products =====

router.get("/listproducts", function (req, res, next) {
  if (req.session.adminloggedIn) {
    productHelper.viewproducts().then((response) => {
      if (response) {
        const productsData = response.data;
        res.render("admin/listProducts", { productsData });
      }
    });
  } else res.redirect("/admin/login");
});

// -------Delete Product------

router.post("/deleteProduct", (req, res) => {
  productHelper.deleteProduct(req.body).then((response) => {
    res.redirect("/admin/listproducts");
  });
});




// ===========User Management========



// =====List Users=====

router.get("/listusers", function (req, res, next) {
  if (req.session.adminloggedIn) {
    adminHelper.getusersData().then((response) => {
      if (response.status) {
        res.render("admin/listUsers", { usersData: response.usersdata });
      } else {
        res.send(err);
      }
    });
  } else res.redirect("/admin/login");
});

// =========block users=====

router.post("/blockUser", (req, res) => {
  adminHelper.blockUser(req.body).then(() => {

    res.redirect("/admin/listusers");


  });
});

/// =======Unblock user =======

router.post("/unBlockUser", (req, res) => {
  adminHelper.unBlockUser(req.body).then(() => {
    res.redirect("/admin/listusers");
  });
});

// --------logout--------

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
