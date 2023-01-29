/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');
const adminslist = require('../models/adminmodel');
const userslist = require('../models/usermodel');
const orders = require('../models/ordersmodel');
const coupon = require("../models/couponmodel");
const moment = require("moment");
const categorymodel = require('../models/categorymodel');
const productmodel = require('../models/productmodel');
const { date } = require('random-js');
const indianTime = new Date();
const options = { timeZone: 'Asia/Kolkata' };

const adminLogin = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admindoc = await adminslist.findOne({ email: data.email });
            if (admindoc) {
                bcrypt.compare(data.password, admindoc.password, (err, result) => {
                    if (err) { throw err; }
                    if (result) {
                        resolve({ status: true, admin: true, admindoc });
                    }
                    else {
                        resolve({ status: false, admin: true });
                    }
                });
            }
            else {
                resolve({ status: false, admin: false });
            }
        } catch (error) {
            throw error;
        }

    });
};



const dashBoard = async (req, res) => {
    try {
        const user_count = await userslist.countDocuments({ blocked: false });
        const orders_count = await orders.countDocuments({});
        const confirmed_count = await orders.countDocuments({ "currentStatus.status": "Confirmed" });
        const shipped_count = await orders.countDocuments({ "currentStatus.status": "Shipped" });
        const delivered_count = await orders.countDocuments({ "currentStatus.status": "Delivered" });
        const cancelled_count = await orders.countDocuments({ "currentStatus.status": "cancelled" });
        const Products_count = await productmodel.countDocuments({ active: true });
        const totalRevenue = await orders.aggregate([
            {
                $match: { "currentStatus.status": "Delivered" }

            },
            { $project: { totalRevenue: { $sum: "$totalAmount" } } }

        ])
        console.log("totalRevenue", totalRevenue);


        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const salesreport = await orders.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$orderOn" },
                        year: { $year: "$orderOn" }
                    },
                    sales: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    sales: 1,
                    _id: 0
                }
            }
        ])



        // extract the month and sales data from the report
        // let labels = salesreport.map(d => d.month+""+d.year);
        let labels = salesreport.map(d => monthNames[d.month - 1] + "-" + d.year);

        let data = salesreport.map(d => d.sales);

        console.log("labels", labels);
        console.log("data", data);

        const counts = {
            user_count: user_count,
            orders_count: orders_count,
            totalRevenue: totalRevenue,
            Products_count: Products_count,
        }
        const piechart = {
            confirmed_count: confirmed_count,
            shipped_count: shipped_count,
            delivered_count: delivered_count,
            cancelled_count: cancelled_count
        }
        let sales = salesreport.map(item => {
            return {
                date: monthNames[item.month - 1] + "-" + item.year,
                sales: item.sales
            }
        })
        // let sales = salesreport.map(item => {
        //     return {
        //         date: item.month,
        //         sales: item.sales
        //     }
        // })
        console.log("sales", sales);
        let pie_chart = JSON.stringify(piechart);
        let salesData = JSON.stringify(sales)
        let dataforlinegraph = JSON.stringify(data)
        let labelforline = JSON.stringify(labels)
        res.render("admin/dashboard", { counts, pie_chart, salesData ,dataforlinegraph,labelforline})
    } catch (error) {
        throw new Error(error)
    }

}
const salesReport = async (req, res) => {
    res.render("admin/analytics")
}

// ---manage users----

const getusersData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await userslist.find({}).lean().then((usersdata) => {
                resolve({ status: true, usersdata });
                resolve({ status: true });
            }).catch((error) => {
                throw error;
            });
        } catch (error) {
            throw error;

        }
    });
};
const blockUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userslist.findOneAndUpdate({ email: data.email }, { blocked: true }, { new: true })
                .then((data) => {
                    resolve({ status: true, data });
                }).catch((error) => {
                    throw error;

                });
        } catch (err) {
            throw err;
        }
    });
};
const unBlockUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userslist.findOneAndUpdate({ email: data.email }, { blocked: false }, { new: true })
                .then((data) => {
                    resolve({ status: true, data });
                }).catch((error) => {
                    throw error;
                });
        } catch (err) {
            throw err;
        }
    });
};

// ---manage orders----

const listOrders = async (req, res) => {
    try {
        const ordersData = await orders.find({}).populate({ path: 'user', model: 'users' })
            .lean();

        res.render('admin/listOrders', { ordersData });
    } catch (error) {
        throw error;
    }

};
const viewOrder = async (req, res) => {
    try {
        const orderData = await orders.find({ _id: req.params.orderId }).populate({ path: 'orderItems.product' }).populate({ path: 'user', model: 'users' })
            .lean();
        res.render('admin/viewOrders', { orderData });
    } catch (error) {
        throw error;
    }
};

const changeorderStatus = async (req, res) => {
    try {
        const Status = req.body.Status;
        const ID = new mongoose.Types.ObjectId(req.body.id);
        const newStatus = { status: Status, timestamp: indianTime.toLocaleString('IND', options) };
        await orders.findOneAndUpdate({ _id: ID }, { $set: { currentStatus: newStatus }, $push: { timeline: newStatus } })
            .then(() => {
                res.json({ status: true });
            }).catch(() => {
                res.json({ status: false });
            });
    } catch (error) {
        res.render('error', { error: error });
    }
};
const cancelOrder = async (req, res) => {
    try {
        const Status = "Cancelled";
        const ID = new mongoose.Types.ObjectId(req.body.id);
        const newStatus = { status: Status, timestamp: indianTime.toLocaleString('IND', options) };
        await orders.findOneAndUpdate({ _id: ID }, { $set: { currentStatus: newStatus, cancelled: true }, $push: { timeline: newStatus } })
            .then(() => {
                res.json({ status: true });
            }).catch(() => {
                res.json({ status: false });
            });
    } catch (error) {
        res.render('error', { error: error });
    }
};

const addCoupon = async (req, res) => {
    try {
        const coupons = await coupon.find({ active: true }).lean()
        res.render("admin/addCoupon", { couponAdded: req.session.couponAdded, couponEdited: req.session.couponEdited, coupons })
        req.session.couponAdded = false
        req.session.couponEdited = false
    } catch (error) {
        res.render("error", { error })
    }
}
const saveCoupon = async (req, res) => {
    try {
        const Coupon = await coupon.findOne({ code: req.body.code })
        if (Coupon) {
            res.json({ status: false, CouponExists: true })
        } else {
            const newCoupon = new coupon({
                code: req.body.code,
                discount: req.body.discount,
                expirationDate: req.body.expirationDate,
                max_discount: req.body.maxDiscount,
                min_amount: req.body.minAmount
            })

            await newCoupon.save().then(() => {
                req.session.couponAdded = true
                res.json({ status: true })
            })
        }
    } catch (error) {
        res.render("error", { error })
    }

}
const editCoupon = async (req, res) => {
    const Coupon = await coupon.findOne({ _id: req.params.productId }).lean()
    const dateString = Coupon.expirationDate
    const date = moment(dateString);
    const Date = date.format("YYYY-MM-DD")
    res.render("admin/editCoupon", { Coupon, Date })
}
const saveEditedCoupon = async (req, res) => {
    try {
        await coupon.findOneAndUpdate({ _id: req.body.couponid }, {
            $set: {
                code: req.body.code,
                discount: req.body.discount,
                expirationDate: req.body.expirationDate,
                max_discount: req.body.maxDiscount,
                min_amount: req.body.minAmount
            }
        }).then(() => {
            req.session.couponEdited = true
            res.json({ status: true })
        })

    } catch (error) {
        res.render("error", { error })
    }


}
const deleteCoupon = async (req, res) => {
    try {
        await coupon.findOneAndUpdate({ _id: req.body.couponid }, { $set: { active: false } })
            .then(() => {
                res.json({ status: true })
            })
    } catch (error) {
        res.render("error", { error })
    }
}


const logout = (req, res) => {
    req.session.adminloggedIn = false;
    res.redirect('/admin/login');
};





module.exports = {
    adminLogin,
    dashBoard,
    salesReport,
    getusersData,
    blockUser,
    cancelOrder,
    unBlockUser,
    listOrders,
    viewOrder,
    changeorderStatus,
    addCoupon,
    saveCoupon,
    editCoupon,
    saveEditedCoupon,
    deleteCoupon,
    logout
};
