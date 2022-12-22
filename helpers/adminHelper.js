const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const adminslist=require('../models/adminmodel')
const userslist = require('../models/usermodel');

module.exports={
    adminLogin:(data)=>{
        console.log("adminform",data);
       return new Promise(async(resolve,reject)=>{
        try{
            const admindoc= await adminslist.findOne({email:data.email})
            if(admindoc){
                console.log(admindoc,"admin");
                bcrypt.compare(data.password,admindoc.password,(err,result)=>{
                    if(err) console.log(err)
                    if(result){
                        resolve({status:true, admin:true,admindoc})
                    }
                    else{
                        resolve({status:false,admin:true})
                        console.log("invalid password")
                    }
                })
            }
            else{
                console.log("invalid email")
                resolve({status:false, admin:false})
            }
        }catch(error){
            console.log(error)
        }
         
       })
    },



    getusersData:()=>{
        return new Promise(async(resolve,reject)=>{
           try{
            await userslist.find({}).lean().then((usersdata)=>{
                console.log("success loading users data");
                resolve({status:true,usersdata})
                resolve({status:true})
            }).catch((error)=>{
                console.log("error loading users data",error)
            })
        }catch(error){
               console.log("error loading data base",error)

           }
        })
    }
}