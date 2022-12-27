const userslist = require('../models/usermodel');
const cart = require('../models/cartmodel')
const products = require("../models/productmodel");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const { resolve } = require('path');



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
                const userdoc = await userslist.findOne({ email: data.email })
                if (userdoc) {
                    if (userdoc.blocked) {
                        resolve({ user: true, blocked: true })
                    }
                    else {
                        bcrypt.compare(data.password, userdoc.password, (err, result) => {
                            if (err) throw err
                            if (result) {
                                resolve({ user: true, blocked: false, result, userdoc })
                            }
                            if (!result) {
                                resolve({ user: true, blocked: false, result, userdoc })
                            }
                        })
                    }
                }
                else {
                    resolve({ user: false })
                }

            } catch (error) {
                throw error;
            }
        })
    },


    addToCart: (userID, productID,quantity) => {
        const UserID = new mongoose.Types.ObjectId(userID)
        const ProductID = new mongoose.Types.ObjectId(productID)
        return new Promise(async (resolve, reject) => {
            try {
                // check if the user already has a cart
                const userCart = await cart.findOne({ userId: UserID })
                // If they do not,  create a new cart 
                if (!userCart) {
                    const newCart = new cart({
                        userId: userID,
                        products: [
                            {
                                productId: productID,
                                quantity: 1
                            }
                        ],
                        totalQty: 1
                    })
                    await newCart.save()
                } else {
                    // If they do have a cart add product into the cart

                    const productItem = userCart.products

                    // Check if product is already in the cart

                    const productIndex = productItem.findIndex(item => item.productId.toString() === ProductID.toString())
                    if (productIndex >= 0) {
                        // Increasing quantity of product in cart
                        
                        userCart.products[productIndex].quantity+=quantity;
                       await userCart.save()
                    }
                    else {
                        // Add new product to cart
                        const newProduct = {
                            productId: productID,
                            quantity: 1,
                        }
                        await cart.findOneAndUpdate({ userId: userID }, { $inc: { totalQty: 1 }, $push: { products: newProduct } })
                    }

                }

            } catch (error) {
                throw error
            }

        })
    },

    getCartItems: (userID) => {
        console.log("user id>>", userID);
        const ID = new mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            try {
                const jp = await cart.aggregate([
                    {
                        $match: { userId: { $in: [ID] } }
                        // },{
                        //     $lookup:{
                        //         from:"products"
                        //     }
                    }
                ])
                console.log("jppppp", jp)
            } catch (error) {
                console.log(error);
            }
        })
    }









}


