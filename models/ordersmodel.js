const mongoose = require('mongoose')
const { date } = require('random-js')
const schema = mongoose.Schema
const ObjectId = schema.ObjectId

const orderSchema = new schema({

  user_Id: {
    type: ObjectId,
    required: true
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true
  },
  orderItems: [
    {
      product_Id: {
        type: ObjectId,

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
  orderStatus: {
    type: String,
    default: "Pending",
  },

  paymentStatus: {
    type: String,
    default: "Not Paid",
  },
  orderOn: {
    type: date,
    default: new Date().toISOString(),
  },
  deliveryDate: {
    type: date,
  },
},
  {
    timestamps: true
  }

)
module.exports = mongoose.model('order', orderSchema)