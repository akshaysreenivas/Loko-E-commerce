const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const adminslist = require('../models/adminmodel')
const userslist = require('../models/usermodel')

  
module.exports = {
     adminLogin: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const admindoc = await adminslist.findOne({ email: data.email })
                if (admindoc) {
                    bcrypt.compare(data.password, admindoc.password, (err, result) => {
                        if (err) console.log(err)
                        if (result) {
                            resolve({ status: true, admin: true, admindoc })
                        }
                        else {
                            resolve({ status: false, admin: true })
                        }
                    })
                }
                else {
                    resolve({ status: false, admin: false })
                }
            } catch (error) {
                throw error
            }

        })
     },
      getusersData: () => {
        return new Promise(async (resolve, reject) => {
            try {
                await userslist.find({}).lean().then((usersdata) => {
                    resolve({ status: true, usersdata })
                    resolve({ status: true })
                }).catch((error) => {
                    throw error
                })
            } catch (error) {
                throw error

            }
        })
    },
     blockUser: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await userslist.findOneAndUpdate({ email: data.email }, { blocked: true }, { new: true })
                    .then((data) => {
                        resolve({ status: true, data })
                    }).catch((error) => {
                        throw error;

                    })
            } catch (err) {
                throw err;
            }
        })
    },
     unBlockUser: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await userslist.findOneAndUpdate({ email: data.email }, { blocked: false }, { new: true })
                    .then((data) => {
                        resolve({ status: true, data })
                    }).catch((error) => {
                        throw error;
                    })
            } catch (err) {
                throw err;
            }
        })
    },
     logout: (req, res) => {
        req.session.destroy();
        res.redirect("/admin/login");
    }



}
