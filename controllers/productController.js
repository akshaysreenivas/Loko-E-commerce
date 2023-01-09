
const products = require("../models/productmodel");
const categorys = require('../models/categorymodel');


module.exports = {
  addCategory: async (req, res) => {
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
      throw err
    }

  },

  viewCategory: () => new Promise(async (resolve, reject) => {
    try {
      const Categorys = await categorys.find({}).lean();
      if (Categorys) {
        resolve({ Categorys })
      }
    } catch (err) {
      throw err
    }
  }),

  addProduct: async (req, res) => {
    let data = req.body

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


  viewproductsbycategory: async (req, res) => {
    try {
      let category = req.params.category
      await products.find({ category: category }).lean().then((data) => {
        const productsdata = data.map((data) => {
          return {
            _id: data._id,
            name: data.name,
            price: data.price,
            image: data.images[0].data
          };
        });
        res.render('users/productByCategory', { productsdata, category })
      }).catch((error) => {
        throw error;
      })
    } catch (error) {
      throw error;
    }

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
        throw error
      }
    })
  }








}