const mongoose = require('mongoose')
const schema = mongoose.Schema
const indianTime = new Date();
const options = { timeZone: 'Asia/Kolkata' };



const orderSchema = new schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  address: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      unit_amount: {
        type: Number
      },
      total_amount: {
        type: Number
      },
      quantity: {
        type: Number,
      }
    }
  ],
  totalAmount: {
    type: Number,

  },
  timeline: [
    {
      status: {
        type: String,
        required: true
      },
      timestamp: {
        type: String,
        required: true
      }
    }
  ],
  currentStatus: {
    type: Object,
    required: true
  },
  paymentStatus: {
    type: String,
    default: "Not Paid",
  },
  coupon_used: {
    type: Object,
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  orderOn: {
    type: String,
    default: indianTime.toLocaleString('IND', options),
  },
  deliveryDate: {
    type: String,
  },
})
module.exports = mongoose.model('order', orderSchema)