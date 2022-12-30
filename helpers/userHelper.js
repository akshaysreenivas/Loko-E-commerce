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


    addToCart: (userID, productID, quantity) => {
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
                                productId: ProductID,
                                quantity: 1
                            }
                        ],
                        totalQty: 1
                    })
                    await newCart.save()
                        .then((data) => {
                            resolve({ status: true, data })
                        })
                } else {
                    // If they do have a cart add product into the cart

                    const productItem = userCart.products

                    // Check if product is already in the cart

                    const productIndex = productItem.findIndex(item => item.productId.toString() === ProductID.toString())
                    if (productIndex >= 0) {
                        // Increasing quantity of product in cart

                        userCart.products[productIndex].quantity += quantity;
                        await userCart.save()
                            .then((data) => {
                                resolve({ status: true, data })
                            })
                    }
                    else {
                        // Add new product to cart
                        const newProduct = {
                            productId: productID,
                            quantity: 1,
                        }
                        await cart.findOneAndUpdate({ userId: userID }, { $inc: { totalQty: 1 }, $push: { products: newProduct } }, { new: true })
                            .then((data) => {
                                resolve({ status: true, data })
                            })
                    }

                }

            } catch (error) {
                throw error
            }

        })
    },

    getCartItems: (userID) => {
        const ID = new mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            try {
                const Cart = await cart.findOne({ userId: ID }).lean()
                if (Cart) {
                    const cartItems = await cart.aggregate([
                        {
                            $match: { userId: ID }
                        }, {
                            $unwind: '$products'
                        }, {
                            $project: {
                                productId: '$products.productId',
                                quantity: '$products.quantity',
                                totalQty: '$totalQty',
                                totalCost: '$totalCost'
                            }
                        }, {
                            $lookup: {
                                from: 'products',
                                localField: 'productId',
                                foreignField: '_id',
                                as: 'product'
                            }
                        }, {
                            $project: {
                                productId: 1, quantity: 1, totalQty: 1, product: { $arrayElemAt: ['$product', 0] }
                            }
                        }, {
                            $project: {

                                productId: 1, quantity: 1, totalQty: 1, product: 1, amount: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                            }
                        }
                    ])
                    if (cartItems.length !== 0) {
                        resolve({ status: true, cartItems })
                    }
                    else {
                        resolve({ status: false })
                    }
                }
                else {
                    resolve({ status: false })
                }

            } catch (error) {
                console.log(error);
            }
        })
    },


    getCartCount: (ID) => {

        return new Promise(async (resolve, reject) => {
            let count = 0
            try {
                await cart.findOne({ userId: ID }, { totalQty: 1 }).then((data) => {
                    if (data) {
                        resolve(data.totalQty)
                    } else {
                        resolve(0)
                    }
                })
            } catch (error) {
                throw error;
            }

        })
    },

    getCartTotalamount: (userID) => {
        const usercartID = new mongoose.Types.ObjectId(userID)
        return new Promise(async (resolve, reject) => {
            try {
                const Cart = await cart.findOne({ userId: usercartID }).lean()
                if (Cart) {
                    const totalAmount = await cart.aggregate([
                        {
                            $match: { userId: usercartID }
                        }, {
                            $unwind: '$products'
                        }, {
                            $project: {
                                productId: '$products.productId',
                                quantity: '$products.quantity',
                                totalQty: '$totalQty',
                                totalCost: '$totalCost'
                            }
                        }, {
                            $lookup: {
                                from: 'products',
                                localField: 'productId',
                                foreignField: '_id',
                                as: 'product'
                            }
                        }, {
                            $project: {
                                productId: 1, quantity: 1, totalQty: 1, product: { $arrayElemAt: ['$product', 0] }
                            }
                        }, {
                            $group: {
                                _id: null,
                                totalCost: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                            }
                        }
                    ])
                    if (totalAmount.length !== 0) {
                        resolve({ status: true, totalAmount })
                    }
                    else {
                        resolve({ status: false })
                    }
                }
                else {
                    resolve({ status: false })
                }

            } catch (error) {
                console.log(error);
            }
        })
    },

    deleteCartProduct: (userID, productID, count) => {
        const UserID = new mongoose.Types.ObjectId(userID)
        const ProductID = new mongoose.Types.ObjectId(productID)
        return new Promise(async (resolve, reject) => {
            try {
                await cart.updateOne({ userId: userID }, {
                    $pull: { products: { productId: ProductID } },
                    $inc: { totalQty: count }
                }
                ).then(() => {
                    resolve({ status: true });
                })
            } catch (error) {
                console.log(error);
            }
        })
    },
    changeCartProductCount: (userID, data) => {

        const count = parseInt(data.count)
        const UserID = new mongoose.Types.ObjectId(userID)
        const ProductID = new mongoose.Types.ObjectId(data.id)
        return new Promise(async (resolve, reject) => {
            try {
                const cartitems = await cart.findOne({ userId: userID })
                const productItem = cartitems.products
                const productIndex = productItem.findIndex(item => item.productId.toString() === ProductID.toString())

                if (productIndex >= 0) {
                    if (count == -1 && cartitems.products[productIndex].quantity <= 1) {
                        await cart.updateOne({ userId: UserID }, {
                            $pull: { products: { productId: ProductID } },
                            $inc: { totalQty: count }
                        }
                        ).then(() => {
                            resolve({ status: true });
                        })

                    } else {
                        cartitems.products[productIndex].quantity += count;
                        await cartitems.save().then(() => {
                            resolve({ status: true });

                        })
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    ,


}


