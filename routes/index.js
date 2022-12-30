const express = require("express");
const router = express.Router();
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");

/* GET home page. */

function verifyadminlogin(req,res,next){
  if (req.session.adminloggedIn) {
    next()
  }else{
    res.redirect("/admin/login")
  }
}

router.get("/",verifyadminlogin, function (req, res, next) {
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

router.post("/add-product",verifyadminlogin, (req, res) => {
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

router.get("/addproduct",verifyadminlogin, function (req, res, next) {
    res.render("admin/addProduct", { done: req.session.addedProduct });
});

// -------Edit Product------

router.get("/editProduct/:userId",verifyadminlogin, (req, res) => {
    productHelper.getproduct(req.params.userId).then((response) => {
      if (response.status) {
        res.render("admin/editProduct", { tobeupdate: response.data });
      }
       else
        res.send("fail");
    });
});

router.post("/editproduct",verifyadminlogin, function (req, res, next) {
  productHelper.editproduct(req.body).then((response) => {
    if (response.status) {
      res.redirect("/admin/listproducts");
    } else res.send("error");
  });
});

// ===== List Products =====

router.get("/listproducts", verifyadminlogin,function (req, res, next) {
    productHelper.viewproducts().then((response) => {
      if (response) {
        const productsData = response.data;
        res.render("admin/listProducts", { productsData });
      }
    });
});

// -------Delete Product------

router.post("/deleteProduct",verifyadminlogin, (req, res) => {
  console.log("jdj",req.body.Id);
  productHelper.deleteProduct(req.body).then((response) => {
   res.json(response);
  });
});




// ===========User Management========



// =====List Users=====

router.get("/listusers",verifyadminlogin, function (req, res, next) {
    adminHelper.getusersData().then((response) => {
      if (response.status) {
        res.render("admin/listUsers", { usersData: response.usersdata });
      } else {
        res.send(err);
      }
    });
});

// =========block users=====

router.post("/blockUser",verifyadminlogin, (req, res) => {
  adminHelper.blockUser(req.body).then(() => {

    res.redirect("/admin/listusers");


  });
});

/// =======Unblock user =======

router.post("/unBlockUser",verifyadminlogin, (req, res) => {
  adminHelper.unBlockUser(req.body).then(() => {
    res.redirect("/admin/listusers");
  });
});

// --------logout--------

router.get("/logout",verifyadminlogin, (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
