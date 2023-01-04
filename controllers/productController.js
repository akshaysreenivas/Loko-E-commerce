
const products = require("../models/productmodel");


module.exports = {
  addProduct: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newProduct = new products({
          name: data.name,
          price: data.price,
          size: data.size,
          image_path: data.img_path,
          category: data.category,
          stock: data.quantity,
          product_description: data.description
        })

        return await newProduct.save()
          .then((data) => {
            resolve({ status: true, data })
          }).catch((error) => {
            resolve({ status: false })
            throw error;

          })
      }
      catch (error) {
        throw error;
      }
    })
  },

  editproduct: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await products.findOneAndUpdate({ _id: data.productId }
          , {
            name: data.name,
            price: data.price,
            category: data.category,
            size: data.size,
            stock: data.quantity,
            product_description: data.description
          }, { new: true })
          .then((updatedData) => {
            resolve({ status: true })
          })
          .catch((error) => {
            throw error;
          })
      } catch (error) {
        throw error;
      }
    })
  },


  viewproducts: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await products.find({}).lean().then((data) => {
          resolve({ status: true, data })
        }).catch((error) => {
          throw error;
        })
      } catch (error) {
        throw error;
      }

    })
  },

  getproduct: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await products.findOne({ _id: id }).lean().then((data) => {
          resolve({ status: true, data })
        }).catch((error) => {
          throw error;
        })
      } catch (error) {
        throw error;
      }
    })
  },

  deleteProduct: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await products.deleteOne({ _id: data.Id }).then((data) => {
          if (data) {
            resolve({ status: true })
          }
        })
      } catch (error) {
        console.log( error)
      }
    })
  }








}