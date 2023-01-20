const mongoose = require('mongoose')
const { date } = require('random-js')
const schema = mongoose.Schema
const IndianTime = new Date();
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
      price: {
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
    required:true
  },
  paymentStatus: {
    type: String,
    default: "Not Paid",
  },
  orderOn: {
    type: String,
    default: IndianTime.toLocaleString('IND', options),
  },
  deliveryDate: {
    type: String,
  },
})
module.exports = mongoose.model('order', orderSchema)