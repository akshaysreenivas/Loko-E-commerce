const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/side-bar');
});
router.get('/admin', function(req, res, next) {
  res.render('admin/nav-bar');
});
// router.post('/signup',(req,res)=>{
//   console.log(req.body);
// })

module.exports = router;
