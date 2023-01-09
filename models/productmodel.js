const mongoose = require("mongoose");


const productSc = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    size: {
        type: String,
    },
    images: [{
        data: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    product_description: {
        type: String,
        require: true
    }
})

module.exports = new mongoose.model("products", productSc)