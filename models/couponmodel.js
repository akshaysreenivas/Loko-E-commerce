const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    max_amount: {
        type: Number,
        required: true,
    },
    min_amount: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    }
});

module.exports = new mongoose.model('coupon', couponSchema)








