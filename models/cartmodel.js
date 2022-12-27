const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userslist",
        require:true
    },
    products: [
        {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                require:true
            },
            quantity:{
                type:Number,
                 defaut:1
            },
            totalPrice:{
                type:Number,

            } 

        }
    ],
    totalQty:{
        type:Number,
        default:0
    },
    totalCost: {
        type: Number,
        default:0,
        required: true
        },

})


module.exports = new mongoose.model('cart', CartSchema)








