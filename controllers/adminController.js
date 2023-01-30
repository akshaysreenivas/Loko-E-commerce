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
const productmodel = require('../models/productmodel');
const getSalesReport = require('../helpers.js/salesreport');
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
            }, {
                $sort: { month: 1, year: 1 }
            }
        ])

        const labels = salesreport.map(d => monthNames[d.month - 1] + "-" + d.year);
        const data = salesreport.map(d => d.sales);
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
        const sales = salesreport.map(item => {
            return {
                date: monthNames[item.month - 1] + "-" + item.year,
                sales: item.sales
            }
        })
        const pie_chart = JSON.stringify(piechart);
        const salesData = JSON.stringify(sales)
        const dataforlinegraph = JSON.stringify(data)
        const labelforline = JSON.stringify(labels)
        res.render("admin/dashboard", { counts:counts ?? 0, pie_chart:pie_chart ?? 0, salesData : salesData??0, dataforlinegraph:dataforlinegraph ?? 0, labelforline:labelforline ??0 })
    } catch (error) {
        throw new Error(error)
    }

}

const sales_report = async (fromDate, toDate) => {
    try {
        const sales_report = await orders.aggregate([
            {
                $match: {
                    "currentStatus.status": "Delivered",
                    "orderOn": { $gte: fromDate, $lt: toDate }

                }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$orderOn" },
                        year: { $year: "$orderOn" }
                    },
                    sales: { $sum: "$totalAmount" },
                    products: { $sum: "$orderItems.quantity" },
                    orders: { $sum: 1 },
                }
            },
            {
                $project: { month: "$_id.month", year: "$_id.year", sales: 1, products: 1, orders: 1, _id: 0 }
            }, {
                $sort: { month: 1, year: 1 }
            }
        ])

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const salesReport = sales_report.map(item => {
            return {
                date: monthNames[item.month - 1],
                totalAmount: item.sales,
                totalOrders: item.orders,
                TotalProductsSold: item.products
            }
        })


        return salesReport
    } catch (error) {
        throw new Error(error)
    }
}
const salesReport = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const fromDate = new Date(currentYear, 0, 1)
        const toDate = new Date(currentYear + 1, 0, 1)
        const salesReport = await sales_report(fromDate, toDate)
        res.render("admin/analytics", { salesReport :salesReport??0, currentYear })
    } catch (error) {
        throw new Error(error)
    }
}



const generateSalesReport = async (req, res) => {
    try {
        const fromDate = req.body.fromDate
        const toDate = req.body.toDate
       const salesReport= await sales_report(moment(fromDate, "YYYY-MM-DD").toDate(), moment(toDate, "YYYY-MM-DD").toDate())
        const reportData = await getSalesReport(salesReport)
        if(reportData){
            res.json({ status: true })
        }else{
            res.json({ status: false })
        }
       
    } catch (error) {
        throw new Error(error)
    }
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
    generateSalesReport,
    logout
};
