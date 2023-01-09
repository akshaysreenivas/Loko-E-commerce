const nodemailer = require("nodemailer");



module.exports = {
  otpGenerator: (useremail) => {
    return new Promise((resolve, reject) => {
      let otp = parseInt(Math.random() * 9000)

      // Set the email options
      let mailOptions = {
        from: "lokoecommerse@gmail.com",
        to: useremail,
        subject: "OTP for user verification",
        text: `hello, ${otp} is your loko verification code`
      }
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASSWORD
        }
      })
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve({ status: false })
        } else {
          resolve({ status: true, otp })
        }
      });
    })
  },

}






