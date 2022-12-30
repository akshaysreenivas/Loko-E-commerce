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
           
        }
    ],
    totalQty:{
        type:Number,
        default:0
    },
    
})


module.exports = new mongoose.model('cart', CartSchema)








