const nodemailer = require("nodemailer");



module.exports = {
  otpGenerator: (useremail) => {
    return new Promise((resolve, reject) => {
      let otp = Math.floor(1000 + Math.random() * 8999);
      otp = otp.toString().padStart(4, "0");
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
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_EMAIL_PASSWORD
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






