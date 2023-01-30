const mongoose = require('mongoose');


const WishlistSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                require: true
            }
        }
    ]
   

})


module.exports = new mongoose.model('wishlist', WishlistSchema)