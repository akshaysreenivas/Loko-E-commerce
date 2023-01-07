const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const verifylogin = require("../middleware/loginverify");
// const uploadProductImage  = require("../middleware/image-upload");
const store = require("../middleware/image-upload");
/* GET home page. */

router.get("/", verifylogin.verifyadminlogin, function (req, res, next) {
  res.redirect("admin/listProducts");
});

// ---------admin login---------

// get method
router.get("/login", function (req, res, next) {
  if (req.session.adminloggedIn) res.redirect("/admin");
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

router.get("/img", (req, res) => {
  res.render("admin/img");
});

router.post("/uploadmultiple", store.array("imgs", 12), (req, res) => {
  console.log(req.files);
  res.send("kkll");
});

// =========Product Management=======

router.get("/addCategory", verifylogin.verifyadminlogin, (req, res) => {
  res.render("admin/addcategory");
});

router.post("/addCategory", productController.addCategory);

// -------Add Product------

router.post("/add-product",store.array("photos", 6),productController.addProduct);

router.get("/addproduct",verifylogin.verifyadminlogin,productController.viewCategory
);

// -------Edit Product------

router.get("/editProduct/:userId", verifylogin.verifyadminlogin, (req, res) => {
  productController.getproduct(req.params.userId).then((response) => {
    if (response.status) {
      console.log(response.data );
      res.render("admin/editProduct", { tobeupdate: response.data });
    } else res.send("fail");
  });
});

router.post( "/editproduct",verifylogin.verifyadminlogin,store.array("photos", 6),productController.editproduct);
 
// ===== List Products =====

router.get(
  "/listproducts",
  verifylogin.verifyadminlogin,
  function (req, res, next) {
    productController.viewproducts().then((response) => {
      if (response) {
        const productsData = response.data;
        console.log(productsData);
        res.render("admin/listProducts", { productsData });
      }
    });
  }
);

// -------Delete Product------

router.post("/deleteProduct", verifylogin.verifyadminlogin, (req, res) => {
  productController.deleteProduct(req.body).then((response) => {
    res.json(response);
  });
});

// ===========User Management========

// =====List Users=====

router.get(
  "/listusers",
  verifylogin.verifyadminlogin,
  function (req, res, next) {
    adminController.getusersData().then((response) => {
      if (response.status) {
        res.render("admin/listUsers", { usersData: response.usersdata });
      } else {
        res.send(err);
      }
    });
  }
);

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

router.get("/logout", adminController.logout);

module.exports = router;
