const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const verifylogin = require('../middleware/loginverify');
const upload = require('../middleware/image-upload');
const cloudinaryUpload = require("../utils/cloudinary")




/* GET home page. */

router.get('/', verifylogin.verifyadminlogin, function (req, res) {
  res.redirect('admin/dashboard');
});

// ---------admin login---------

// get method
router.get('/login', function (req, res) {
  if (req.session.adminloggedIn) { res.redirect('/admin'); }
  else {
    res.render('admin/login', { message: req.session.message });
    req.session.message = '';
  }
});

// post method

router.post('/adminlogin', (req, res) => {
  adminController.adminLogin(req.body).then((response) => {
    if (response.admin) {
      if (response.status) {
        req.session.adminloggedIn = true;
        res.redirect('/admin');
      } else {
        req.session.message = 'invalid password';
        res.redirect('/admin/login');
      }
    } else {
      req.session.message = 'You are not authorised to accesss';
      res.redirect('/admin/login');
    }
  });
});


// =========Product Management=======

// -------  coupons -----

router.get('/addCoupons', verifylogin.verifyadminlogin, adminController.addCoupon);
router.post('/saveCoupon', verifylogin.verifyadminlogin, adminController.saveCoupon);
router.get('/editCoupon/:productId', verifylogin.verifyadminlogin, adminController.editCoupon);
router.post('/saveEditedCoupon', verifylogin.verifyadminlogin, adminController.saveEditedCoupon);
router.post('/deleteCoupon', verifylogin.verifyadminlogin, adminController.deleteCoupon);

// ------- add categorys -----

router.get('/addCategory', verifylogin.verifyadminlogin, productController.loadcategory);
router.post('/addCategory', verifylogin.verifyadminlogin, upload.single('categoryimage'), productController.addCategory);


//  ------ edit categorys -----

router.get('/editCategory/:categoryId', verifylogin.verifyadminlogin, productController.loadEditCategory);
router.post('/editCategory', verifylogin.verifyadminlogin, upload.single('categoryimage'), productController.editCategory);

// -------Delete Categorys-------
router.post('/deleteCategory/:categoryId/:imgpath', verifylogin.verifyadminlogin, productController.deleteCategory);


// -------Add Product------

router.post('/add-product', verifylogin.verifyadminlogin, upload.array('photos',4), productController.addProduct);

router.get('/addproduct', verifylogin.verifyadminlogin, async (req, res) => {
  await productController.viewCategory().then((response) => {
    Categorys = response.Categorys;
  });
  res.render('admin/addProduct', { Categorys, productAdded: req.session.productAdded });
  req.session.productAdded = false;
});

// -------Edit Product------

router.get('/editProduct/:productId', verifylogin.verifyadminlogin, (req, res) => {
  productController.getproduct(req.params.productId).then((response) => {
    if (response.status) {
      res.render('admin/editProduct', { tobeupdate: response.data });
    } else { res.send('fail'); }
  });
});

router.post('/editproduct', verifylogin.verifyadminlogin, productController.editproduct);

// ===== List Products =====

router.get(
  '/listproducts',
  verifylogin.verifyadminlogin,
  function (req, res, next) {
    productController.viewproducts().then((response) => {
      if (response) {
        const productsData = response.data;
        res.render('admin/listProducts', { productsData });
      }
    });
  }
);

// ------- change status of  product------

router.post('/deleteProduct', verifylogin.verifyadminlogin, (req, res) => {
  productController.deleteProduct(req.body).then((response) => {
    res.json(response);
  });
});

// ===========User Management========

// =====List Users=====

router.get(
  '/listusers',
  verifylogin.verifyadminlogin,
  function (req, res, next) {
    adminController.getusersData().then((response) => {
      if (response.status) {
        res.render('admin/listUsers', { usersData: response.usersdata });
      } else {
        res.send(err);
      }
    });
  }
);

// --- order manage ----

router.get('/orders', verifylogin.verifyadminlogin, adminController.listOrders);
router.get('/orderdetails/:orderId', verifylogin.verifyadminlogin, adminController.viewOrder);
router.post('/changeOrderStatus/', verifylogin.verifyadminlogin, adminController.changeorderStatus);
router.post('/cancelOrder', verifylogin.verifyadminlogin, adminController.cancelOrder);

//  ------- dashboard-----
router.get("/dashboard", verifylogin.verifyadminlogin, adminController.dashBoard)
// --------sales report------
router.get("/salesreport", verifylogin.verifyadminlogin, adminController.salesReport)

router.post("/generateSalesReport", verifylogin.verifyadminlogin, adminController.generateSalesReport)
// =========block users=====

router.post('/blockUser', verifylogin.verifyadminlogin, (req, res) => {
  adminController.blockUser(req.body).then(() => {
    res.redirect('/admin/listusers');
  });
});

/// =======Unblock user =======

router.post('/unBlockUser', verifylogin.verifyadminlogin, (req, res) => {
  adminController.unBlockUser(req.body).then(() => {
    res.redirect('/admin/listusers');
  });
});



// --------logout--------

router.get('/logout', adminController.logout);

module.exports = router;
