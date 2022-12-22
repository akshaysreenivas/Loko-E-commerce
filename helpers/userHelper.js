const userslist = require('../models/usermodel');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");



module.exports = {
    userSignup: (userdata) => {
        return new Promise(async (resolve, reject) => {
            console.log("name", userdata.name);
            try {
                const newUser = new userslist({
                    name: userdata.name,
                    email: userdata.email,
                    password: userdata.password
                })
                return await newUser.save()
                    .then((data) => {
                        console.log('saved data>>', data)
                        resolve({ status: true, data })
                    })
                    .catch((err) => {
                        console.log("email already exists", err)
                        resolve({ status: false })
                    })
            }
            catch (error) {
                console.log('cant add data', error);
            }
        })
    },

    dologin: (data) => {
        return new Promise(async (resolve, reject) => {
            console.log('log>>>>', data)
            try {
                let userdoc = await userslist.findOne({ email: data.email })
                if (!userdoc) {
                    console.log('user dont exist');
                    resolve({ user: false })
                }
                if (userdoc) {
                    bcrypt.compare(data.password, userdoc.password, (err, result) => {
                        if (err) throw err
                        if (result) {
                            console.log('valid');
                            resolve({ user: true, status: true ,result})
                        } else {
                            console.log('invalid');
                            resolve({ user: true, status: false })
                        }
                    })
                }
            } catch (error) {
                console.log("error loding>>>>>>", error);

            }

        })
    }









}


