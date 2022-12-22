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
    size:{
        type:String,
    },
    image_path: {
        type: String
    },
    category: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    product_description: {
        type: String,
        require: true
    }
})

module.exports=new mongoose.model("products",productSc)