const mongoose=require('mongoose');


const adminsDatasc=new mongoose.Schema({
    name:String,
    password:String,
    email:String
})

module.exports=new mongoose.model('adminsList', adminsDatasc)