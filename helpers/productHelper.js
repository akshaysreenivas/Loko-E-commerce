const { rejects } = require("assert");
const { resolve } = require("path");
const products = require("../models/productmodel");


module.exports = {
  addProduct: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newProduct = new products({
          name: data.name,
          price: data.price,
          size:data.size,
          image_path: data.img_path,
          category: data.category,
          quantity: data.quantity,
          product_description: data.description
        })

        return await newProduct.save()
          .then((data) => {
            console.log("new added products", data)
            resolve({ status: true, data })
          }).catch((error) => {
            resolve({ status: false })
            console.log("cant add product", error)
          })
      }
      catch (error) {
        console.log("cant connect to batabase");
      }
    })
  },

  editproduct: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data)
        await products.findOneAndUpdate({ _id: data.productId }
          , {
            name: data.name,
            price: data.price,
            category: data.category,
            size:data.size,
            quantity: data.quantity,
            product_description: data.description
          }, { new: true })
          .then((updatedData) => {
            console.log("updatedData", updatedData)
            resolve({ status: true })
          })
          .catch((error) => {
            console.log("error updating", error)
          })
      } catch (error) {
        console.log("error updating in the data base", error)

      }
    })
  },


  viewproducts: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await products.find({}).lean().then((data) => {
          console.log("success fetch products");
          resolve({ status: true, data })
        }).catch((error) => {
          console.log("error fetch products", error);
          resolve({ status: false })
        })
      } catch (error) {
        console.log("error fetch products", error);
      }

    })
  },

  getproduct: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await products.findOne({ _id: id }).lean().then((data) => {
          resolve({ status: true, data })
        }).catch((error) => {
          console("error finding data", error)
        })
      } catch (error) {
        console.log("error finding data from db", error)
      }
    })
  },

  deleteProduct: (data) => {
    return new Promise(async (resolve, reject) => {
      try{
      await products.deleteOne({_id:data.id}).then((data)=>{
        if(data){
          console.log("success deletion",data);
          resolve({status:true})
        }
      })
      }catch(error){
console.log('cant delete from db',error)
      }
    })
  }

















}