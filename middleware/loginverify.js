module.exports = {

  verifyLogin: (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect("/login");
      res.json({login:false})
    }
  }
  ,
  verifyadminlogin: (req, res, next) => {
    if (!req.session.adminloggedIn) {
      res.redirect("/admin/login")
    } else {
      next()

    }
  }
}