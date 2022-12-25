const userslist = require('../models/usermodel');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");



module.exports = {
    userSignup: (userdata) => {
        return new Promise(async (resolve, reject) => {
            try {
                const newUser = new userslist({
                    name: userdata.name,
                    email: userdata.email,
                    password: userdata.confirmPassword
                })
                return await newUser.save()
                    .then((data) => {
                        resolve({ status: true, data })
                    })
                    .catch((err) => {
                        resolve({ status: false })
                    })
            }
            catch (error) {
                throw error;
            }
        })
    },

    dologin: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await userslist.findOne({ email: data.email }).exec((err, userdoc) => {
                    if (err) throw err
                    if (!userdoc) {
                        resolve({ user: false })
                    }
                    if (userdoc) {
                        if (userdoc.blocked) {
                            resolve({ blocked: true })
                        }
                        else {
                            bcrypt.compare(data.password, userdoc.password, (err, result) => {
                                if (err) throw err
                                if (result) {
                                    resolve({ user: true, status: true, result, blocked: false, userdoc })
                                } else {
                                    resolve({ user: true, status: false })
                                }
                            })
                        }
                    }
                })

            } catch (error) {
                throw error;
            }
        })
    }









}


