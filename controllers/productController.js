
const products = require("../models/productmodel");
const categorys = require('../models/categorymodel');


module.exports = {
  addCategory: async (req, res) => {
    console.log("called", req.body);
    try {
      const category = await categorys.findOne({ title: req.body.title })
      if (category) {
        res.json({ exist: true });
      } else {
        const newCategory = new categorys({
          title: req.body.title,
          // slug: data.slug
        })
        await newCategory.save().then(() => {
          res.json({ status: true })
        })
      }
    } catch (err) {
      console.log(err);
    }

  },

  viewCategory: async (req, res) => {
    try {
      const Categorys = await categorys.find({}).lean()
      let productAdded = false
      if (req.session.productAdded) {
        productAdded = req.session.productAdded
      }
      if (Categorys) {
        res.render("admin/addProduct", { Categorys, productAdded });
        req.session.productAdded = false

      }
    } catch (err) {
      console.log(err);
    }


  },
  addProduct: async (req, res) => {
    let data = req.body
    console.log("fi", data)
    console.log("files", req.files)
    try {
      const newProduct = new products({
        name: data.name,
        price: data.price,
        size: data.size,
        images: [],
        category: data.category,
        stock: data.quantity,
        product_description: data.description
      })
      for (let i = 0; i < req.files.length; i++) {
        // Add the image data and content type to the product object
        newProduct.images.push({
          data: req.files[i].filename.toString('base64'),
          contentType: req.files[i].mimetype
        });
      }
      return await newProduct.save()
        .then(() => {
          req.session.productAdded = true
          res.redirect('/admin/addProduct')
        }).catch((error) => {
          throw error;
        })
    }
    catch (error) {
      throw error;
    }
  },

  editproduct: (req, res) => {
    let data = req.body
    let images = req.files
    console.log(images);


    new Promise(async (resolve, reject) => {
      try {
        await products.findOneAndUpdate({ _id: data.productId }
          , {
            name: data.name,
            price: data.price,
            category: data.category,
            size: data.size,
            stock: data.quantity,
            product_description: data.description,
            images: images
          }, { new: true })
          .then((updatedData) => {
            res.redirect("/admin/listproducts");
          })
          .catch((error) => {
            res.send("error")
            throw error;
          })
      } catch (error) {
        throw error;
      }
    })
  },


  viewproductsbycategory: (req, res) => {
    new Promise(async (resolve, reject) => {
      try {
        await products.find({ category: data }).lean().then((data) => {
          resolve({ status: true, data })
        }).catch((error) => {
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
        console.log(error)
      }
    })
  }








}