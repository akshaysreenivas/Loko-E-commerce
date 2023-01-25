const mongoose = require("mongoose");
const { string } = require("random-js");


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    selling_price:{
        type: Number,
        require: true
    },
    size: {
        type: String,
        require:true
    },
    images:[{
        type:Object
    }] ,
    category: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'categorys'
    },
    categoryId:{
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
    },
    active: {
        type: Boolean,
        default: true,
    }
})

module.exports = new mongoose.model("products", productSchema)