const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const adminslist = require('../models/adminmodel')
const userslist = require('../models/usermodel');
const orders = require("../models/ordersmodel");

const indianTime = new Date();
const options = { timeZone: 'Asia/Kolkata' };

const adminLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admindoc = await adminslist.findOne({ email: data.email })
            if (admindoc) {
                bcrypt.compare(data.password, admindoc.password, (err, result) => {
                    if (err) throw err
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
}

// ---manage users----

const getusersData = () => {
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
}
const blockUser = (data) => {
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
}
const unBlockUser = (data) => {
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
}

// ---manage orders----

const listOrders = async (req, res) => {
    try {
        const ordersData = await orders.find({}).populate({ path: "user", model: 'users' })
            .lean()

        res.render("admin/listOrders", { ordersData })
    } catch (error) {
        throw error
    }
}
const viewOrder = async (req, res) => {
    try {
        const orderdata = await orders.find({ _id: req.params.orderId }).populate({ path: "orderItems.product" }).populate({ path: "user", model: 'users' })
            .lean()

        const orderData = orderdata.map(order => {
            order.orderItems = order.orderItems.map(item => {
                if( item.product)
                item.image = item.product.images[0];
                return item;
            });
            return order;
        });


        res.render("admin/viewOrders", { orderData })
    } catch (error) {
        throw error
    }
}

const changeorderStatus = async (req, res) => {
    try {
        const Status = req.body.Status
        const ID = new mongoose.Types.ObjectId(req.body.id)
        const newStatus = { status: Status, timestamp: indianTime.toLocaleString('IND', options) }
        await orders.findOneAndUpdate({ _id: ID }, { $set: { currentStatus: newStatus }, $push: { timeline: newStatus } })
            .then(() => {
                res.json({ status: true })
            }).catch(() => {
                res.json({ status: true })
            })
    } catch (error) {
        res.render("error", { error: error })
    }
}


const logout = (req, res) => {
    req.session.adminloggedIn = false;
    res.redirect("/admin/login");
}





module.exports = {
    adminLogin,
    getusersData,
    blockUser,
    unBlockUser,
    listOrders,
    viewOrder,
    changeorderStatus,
    logout
}
