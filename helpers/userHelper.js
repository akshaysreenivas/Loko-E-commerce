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
              const userdoc =  await userslist.findOne({ email: data.email })                         
                    if (userdoc) {
                        if (userdoc.blocked) {
                            resolve({ user:true, blocked: true})
                        }
                        else {
                            bcrypt.compare(data.password, userdoc.password, (err, result) => {
                                if (err) throw err
                                if (result) {
                                    resolve({ user: true,blocked: false, result, userdoc })
                                } 
                                if (!result) {
                                    resolve({ user: true,blocked: false, result, userdoc })
                                } 
                            })
                        }
                    }
               else{
                resolve({ user:false})                
               }

            } catch (error) {
                throw error;
            }
        })
    }









}


