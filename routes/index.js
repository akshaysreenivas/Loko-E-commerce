const express = require('express');
const router = express.Router();
const adminHelper = require('../helpers/adminHelper');
const productHelper = require("../helpers/productHelper");


/* GET home page. */

// router.get('/', function(req, res, next) {
//   if(req.session.adminloggedIn){
//     const userData=[{name:"akshay"}]
//     const productsData=[{name:"akshayshirt"}] 
//     res.render('admin/adminpanel',{productsData,userData});
//   } 
//   else
//   res.redirect('/admin/login');

// });

// ---------admin login---------

// get method   
router.get('/login', function (req, res, next) {
  if (req.session.adminloggedIn)
    res.redirect('/admin');
  else {
    res.render('admin/login', { message: req.session.message });
    req.session.message = "";
  }
});

// post method    

router.post('/adminlogin', (req, res) => {
  console.log("...>>>", req.body);
  adminHelper.adminLogin(req.body).then((response) => {
    console.log("index", response.status)
    if (response.admin) {
      if (response.status) {
        req.session.adminloggedIn = true
        res.redirect('/admin')
      } else {
        req.session.message = "invalid password"
        console.log("incorrect password");
        res.redirect('/admin/login');
      }
    } else {
      req.session.message = "You are not authorised to accesss"

      console.log("incorrect email");
      res.redirect('/admin/login');
    }
  })
});


// -------Add Product------

router.post('/add-product', (req, res) => {
  console.log("products to be added", req.body);
  productHelper.addProduct(req.body).then((response) => {
    console.log("added data", response.data)
    res.send("success")
  })
})


router.get('/addproduct', function (req, res, next) {
  // if(req.session.adminloggedIn)
  res.render('admin/addProduct');
  // else
  // res.redirect('/admin/login');

});

// // -------Edit Product------

router.get('/editProduct/:userId', (req, res) => {
  productHelper.getproduct(req.params.userId).then((response) => {
    if(response.status){
      console.log("to be updated one data", response.data)
      res.render('admin/editProduct',{tobeupdate:response.data});

    }else
    res.send("fail")

  })
})


router.post('/editproduct', function (req, res, next) {
  // if(req.session.adminloggedIn)
  productHelper.editproduct(req.body).then((response)=>{
    if(response.status){
      res.redirect('/admin/listproducts')
    }
  })
  // else
  // res.redirect('/admin/login');

});

// ===== List Products =====

router.get('/listproducts', function (req, res, next) {
  // if(req.session.adminloggedIn){
  productHelper.viewproducts().then((response) => {
    if (response) {
      const productsData = response.data
      // console.log("products", productsData);
      res.render('admin/listProducts', { productsData });
    }

  })
  // }
  // else
  // res.redirect('/admin/login');

});


// =====List Users=====

router.get('/listusers', function (req, res, next) {
  // if(req.session.adminloggedIn){
  adminHelper.getusersData().then((response) => {
    if (response.status) {
      res.render('admin/listUsers', { usersData:response.usersdata });
    } else {
      res.send(err)
    }
  })
  // }
  // else
  // res.redirect('/admin/login');

});

// -------Delete Product------

router.post('/add-product', (req , res) => {
  console.log("products to be added", req.body);
  productHelper.editproduct(req.body).then((response) => {
    console.log("added data", response.data)
    res.send("success")
  })
})


// --------logout--------

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login')
})

module.exports = router;
