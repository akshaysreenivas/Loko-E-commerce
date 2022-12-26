const mongoose = require('mongoose');


const cartSc=new mongoose.Schema({

userId:{
    type:mongoose.Schema.Types.ObjectId
},
products:[
{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    quantity:Number
}
],

})