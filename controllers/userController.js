const users = require('../models/usermodel');
const cart = require('../models/cartmodel')
const nodemailer = require('../config/nodemailer')
const orders = require('../models/ordersmodel')
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const IndianTime = new Date();
const options = { timeZone: 'Asia/Kolkata' };



const userSignup = (req, res) => {
    userdata = req.body
    new Promise(async (resolve, reject) => {
        try {
            let user = await users.findOne({ email: userdata.email })
            if (user) {
                if (user.verified) {
                    res.redirect("/signup", { message: "Looks like already have an account with this email! , login instead? " });
                } else {
                    nodemailer.otpGenerator(userdata.email)
                        .then((response) => {
                            if (response.status) {
                                req.session.tempuseremail = user.email
                                req.session.otp = response.otp
                                res.render('users/otp')
                            }
                        })
                }
            }
            else {
                const newUser = new users({
                    name: userdata.name,
                    email: userdata.email,
                    password: userdata.confirmPassword,
                })
                return await newUser.save()
                    .then(() => {
                        nodemailer.otpGenerator(userdata.email)
                            .then((response) => {
                                if (response.status) {
                                    req.session.tempuseremail = newUser.email
                                    req.session.otp = response.otp
                                    res.redirect('/otp-validation')
                                }
                            })
                    })
                    .catch((err) => {
                        throw err
                    })
            }
        }
        catch (error) {
            throw error
        }
    })

}

const otpValidator = async (req, res) => {
    let originalotp = parseInt(req.session.otp)
    let enteredotp = parseInt(req.body.otp)

    if (enteredotp === originalotp) {
        await users.findOneAndUpdate({ email: req.session.tempuseremail }, { $set: { verified: true } })
        res.redirect('/login')
        req.session.otp = null;
    } else {
        req.session.invalidOtp = "Invalid OTP"
        res.redirect('/otp-validation')
    }
}

const dologin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userdoc = await users.findOne({ email: data.email })
            if (userdoc) {
                if (!userdoc.verified) {
                    nodemailer.otpGenerator(userdata.email)
                    return
                }
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
}

const userdetails = async (user_Id) => {
    try {
        return await users.findOne({ _id: user_Id }).lean()

    } catch (error) {
        throw error
    }
}

const viewProfile = async (req, res) => {
    let user = await userdetails(req.session.user._id)
    res.render("users/profile", { user: user });
}
const manageProfile = async (req, res) => {

    res.render('users/profileManage', { user: req.session.user })
}
const addAddress = async (req, res) => {
    let userid = req.session.user._id
    let newaddressDetails = {
        name: req.body.name,
        phone: req.body.phone,
        street: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pin_code: req.body.pin,
    }
    try {
        await users.updateOne({ _id: userid }, { $push: { addressDetails: newaddressDetails } }, { new: true }).then(() => {
            res.json({ status: true })
        })
    } catch (err) {
        throw err
    }
}

const manageAddress = async (req, res) => {
    let userid = req.session.user._id
    let userAddress;
    let address = await users.findOne({ _id: userid }, 'addressDetails').lean()
    if (address) {
        userAddress = address.addressDetails
    }
    res.render('users/addressBook', { userAddress, user: req.session.user, })
}
const orderManage = async (req, res) => {
    let allOrders = await orders.find({ user: req.session.user._id }).populate({ path: "orderItems.product" }).lean()
    console.log("allOrders", allOrders);
    res.render('users/orders', { allOrders, user: req.session.user })
}

const addressTobeEdited = async (req, res) => {
    let useraddress;
    let address = await users.findOne({ _id: req.session.user._id, "addressDetails._id": req.params.addressid }, { "addressDetails.$": 1 }).lean()
    if (address) {
        useraddress = address.addressDetails[0]
    }
    res.render("users/editaddress", { user: req.session.user, useraddress })
}



const editAddress = async (req, res) => {
    try {
        let newAddress = {
            _id: req.body.addressid,
            name: req.body.name,
            phone: req.body.phone,
            street: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin,
        }
        await users.findOneAndUpdate({ _id: req.session.user._id, "addressDetails._id": req.body.addressid }, { $set: { "addressDetails.$": newAddress } })
            .then(() => {
                res.json({ status: true })
            })
    } catch (error) {
        res.json({ status: false, error })
    }
}

const deleteAddress = async (req, res) => {

    try {
        await users.updateOne({ _id: req.session.user._id }, { $pull: { addressDetails: { _id: req.body.Id } } })
            .then(() => {
                res.json({ status: true })
            })
    } catch (error) {
        throw error;
    }
}


const changeName = async (req, res) => {
    try {
        await users.findOneAndUpdate({ _id: req.session.user._id }, { $set: { name: req.body.name } })
            .then(() => {
                req.session.user.name = req.body.name
                res.json({ status: true })
            })
    } catch (error) {
        res.json({ error, status: false })
    }
}

const otpGeneration = async (req, res) => {
    try {
        nodemailer.otpGenerator(req.body.email)
            .then((response) => {
                if (response.status) {
                    req.session.otp = response.otp
                    res.json({ status: true })
                } else {
                    res.json({ status: false })

                }
            })
    } catch (error) {
        res.json({ status: false, error })

    }
}
const otpPage = (req, res) => {
    res.render('users/otpsubmit', { invalidOtp: req.session.invalidOtp })
    req.session.invalidOtp = null
}
const otpVerification = async (req, res) => {
    let originalotp = parseInt(req.session.otp)
    let enteredotp = parseInt(req.body.otp)

    try {
        if (originalotp === enteredotp) {
            res.render("users/changePassword")
            req.session.otp = null
        } else {
            req.session.invalidOtp = "Invalid OTP"

            res.redirect("/changeuserdetailsOtp")
        }
    } catch (error) {
        res.json({ status: true, error })
    }

}



const changePassword = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password1, 10);
        await users.findOneAndUpdate({ _id: req.session.user._id }, { $set: { password: hashedPassword } })
            .then(() => {
                res.redirect("/profile")
            }).catch((error) => {
                res.json({ status: false, error })

            })
    } catch (error) {
        res.json({ error, status: false })
    }
}
const changeEmail = async (req, res) => {
    try {
        await users.findOneAndUpdate({ _id: req.session.user._id }, { $set: { email: req.body.email } })
            .then(() => {
                req.session.user.email = req.body.email
                res.json({ status: true })
            })
    } catch (error) {
        res.json({ error, status: false })
    }
}

const addToCart = (userID, productID, quantity) => {
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
}

const getCartItems = (userID) => {
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

                    }, {
                        $project: {

                            productId: 1, quantity: 1, totalQty: 1, product: 1, amount: 1, image: { $arrayElemAt: ['$product.images', 0] }
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
            throw error
        }
    })
}

const getCartCount = (ID) => {

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
}

const getCartTotalamount = (userID) => {
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
            throw error
        }
    })
}

const deleteCartProduct = async (req, res) => {
    let count = -1;
    let userID = req.session.user._id
    let productID = req.params.productID
    try {
        await cart.updateOne({ userId: userID }, {
            $pull: { products: { productId: productID } },
            $inc: { totalQty: count }
        }
        ).then(() => {
            res.json({ status: true });
        })
    } catch (error) {
        throw error
    }

}

const changeCartProductCount = (userID, data) => {
    let count = parseInt(data.count)
    let UserID = new mongoose.Types.ObjectId(userID)
    let ProductID = new mongoose.Types.ObjectId(data.id)
    return new Promise(async (resolve, reject) => {
        try {
            const cartitems = await cart.findOne({ userId: userID })
            const productItem = cartitems.products
            const productIndex = productItem.findIndex(item => item.productId.toString() === ProductID.toString())

            if (productIndex >= 0) {
                if (count == -1 && cartitems.products[productIndex].quantity == 1) {
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
            throw error
        }
    })
}

const viewCheckout = async (req, res) => {
    try {
        let userid = req.session.user._id
        let userAddress;
        let address = await users.findOne({ _id: userid }, 'addressDetails').lean()
        if (address) {
            userAddress = address.addressDetails
        }
        res.render('users/checkout', { userAddress, user: req.session.user, })
    } catch (err) {
        throw err
    }
}

const cartPlaceOrder = async (req, res) => {
    console.log("req.body", req.body);
    try {
        let addressId = req.body.address
        let userid = req.session.user._id
        let ID = new mongoose.Types.ObjectId(userid)
        const Address = await users.findOne({ _id: userid }, { addressDetails: { $elemMatch: { _id: addressId } } }).lean()
        let items = await cart.aggregate([
            {
                $match: { userId: ID }
            }
            , {
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

            }, {
                $project: {

                    productId: 1, quantity: 1, totalQty: 1, amount: 1
                }
            }
        ])
        const OrderItems = items.map((items) => {
            return {
                product: items.productId,
                price: items.amount,
                quantity: items.quantity
            }
        });
        let Status = req.body.paymentMethod === "cash_on_delivery" ? 'Confirmed' : 'Pending'
        let newStatus = { status: Status, timestamp: IndianTime.toLocaleString('IND', options) }

        let TotalAmount = items.reduce((acc, crr) => acc + crr.amount, 0)
        const newOrder = new orders({
            user: userid,
            address: Address.addressDetails[0],
            paymentMethod: req.body.paymentMethod,
            timeline: [],
            currentStatus: newStatus,
            orderItems: OrderItems,
            totalAmount: TotalAmount,
        })
        newOrder.timeline.push({ status: Status, timestamp: IndianTime.toLocaleString('IND', options) })
        if (req.body.paymentMethod === "cash_on_delivery") {
            await newOrder.save().then(async () => {
                await cart.findOneAndDelete({ userId: ID }).then(() => {
                    res.json({ status: true })
                })
            })
        } else {

        }

    } catch (err) {
        throw err
    }
}

const cancelOrder = async (req, res) => {
    try {
        let userid = req.session.user._id
        let newStatus = { status: "cancelled", timestamp: IndianTime.toLocaleString('IND', options) }
        await orders.findOneAndUpdate({ _id: userid }, { $set: { currentStatus: newStatus } })
    } catch (error) {
        throw error
    }
}

const logout = (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null
    res.redirect("/");
}




module.exports = {
    userSignup,
    otpValidator,
    dologin,
    viewProfile,
    manageAddress,
    changePassword,
    cancelOrder,
    changeName,
    changeEmail,
    otpPage,
    addressTobeEdited,
    otpGeneration,
    otpVerification,
    manageProfile,
    editAddress,
    deleteAddress,
    orderManage,
    addToCart,
    getCartItems,
    getCartCount,
    getCartTotalamount,
    deleteCartProduct,
    changeCartProductCount,
    addAddress,
    viewCheckout,
    cartPlaceOrder,
    logout
}