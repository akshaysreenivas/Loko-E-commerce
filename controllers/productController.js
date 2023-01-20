const products = require("../models/productmodel");
const categorys = require('../models/categorymodel');
const fs = require('fs');
const { findOne } = require("../models/ordersmodel");
const path = require("path");


const addCategory = async (req, res) => {
  let filePath = `${req.file.path}`;
  try {
    const category = await categorys.findOne({ title: req.body.category })
    if (category) {
      fs.unlinkSync(filePath);
      res.json({ exists: true });
    } else {
      const newCategory = new categorys({
        title: req.body.category,
        image: req.file.filename,
        path: req.file.path
      })
      await newCategory.save().then(() => {
        req.session.categoryAdded = true
        res.json({ status: true })
      })
    }
  } catch (err) {
    throw err
  }

}

const loadcategory = async (req, res) => {
  try {
    let categorys;
    await viewCategory().then((response) => {
      if (response.status) {
        categorys = response.Categorys
      }
    })
    res.render("admin/addcategory", { categorys, categoryAdded: req.session.categoryAdded, categoryEdited: req.session.categoryEdited });
    req.session.categoryAdded = false
    req.session.categoryEdited = false
  } catch (error) {
    throw error
  }
}

const loadEditCategory = async (req, res) => {
  try {
    let category = await categorys.find({ _id: req.params.categoryId }).lean();
    if (category) {
      let Category = category[0]
      res.render("admin/editcategory", { Category })
    }
  } catch (error) {
    throw error
  }
}

const editCategory = async (req, res) => {
  try {
    let Category = await categorys.findOne({ _id: req.body.categoryid });
    let filePath = Category.path
    let img;
    let imgpath;
    if (req.file != null) {
      fs.unlinkSync(filePath)
      img = req.file.filename
      imgpath = req.file.path
    } else {
      img = Category.image
      imgpath = filePath
    }
    await categorys.findOneAndUpdate({ _id: req.body.categoryid }, {
      title: req.body.category,
      image: img,
      path: imgpath,
      updatedAt: Date.now()
    }, { new: true }).then(() => {
      req.session.categoryEdited = true
      res.redirect("/admin/addCategory")
    });
  } catch (error) {
    throw error
  }

}

const deleteCategory = async (req, res) => {
  filePath = `public/images/${req.params.imgpath}`
  try {
    fs.unlinkSync(filePath);
    await categorys.deleteOne({ _id: req.params.categoryId }).then(() => {
      res.json({ status: true })
    }).catch((err) => {
      res.json({ err })
    })
  } catch (error) {
    throw error
  }

}

const viewCategory = () => new Promise(async (resolve, reject) => {
  try {
    let Categorys = await categorys.find({}).lean();
    if (Categorys) {
      resolve({ Categorys, status: true })
    } else {
      resolve({ status: false })
    }
  } catch (err) {
    throw err
  }
})

const addProduct = async (req, res) => {
  let data = req.body
  try {
    const newProduct = new products({
      name: data.name,
      price: data.price,
      size: data.size,
      images: req.files,
      selling_price: data.sellingPrice,
      category: data.category,
      stock: data.quantity,
      product_description: data.description
    })

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
}

const editproduct = async (req, res) => {
  let data = req.body
  let images;
  let product = await products.findOne({ _id: req.body.productId })
  console.log('product', product)
  
  product.images.map(item => fs.unlinkSync(item.path))
  if(req.files !=null){
     images = req.files
    }else{
     images= product.images
    }

  try {
    await products.findOneAndUpdate({ _id: data.productId }
      , {
        name: data.name,
        price: data.price,
        selling_price: data.sellingPrice,
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
}

const viewproductsbycategory = async (req, res) => {
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
      res.render('users/productByCategory', { productsdata, category, user: req.session.user, totalItems: req.session.cartItemscount })
    }).catch((error) => {
      throw error;
    })
  } catch (error) {
    throw error;
  }

}

const viewproducts = (data) => {
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
}

const getproduct = (id) => {
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
}

const deleteProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedproduct = await products.findOneAndDelete({ _id: data.Id }, { rawResult: true })
      if (deletedproduct) {
        console.log("deletedproduct", deletedproduct);
        console.log("deletedproducthhhhh", deletedproduct.value);
        deletedproduct.value.images.map(item => fs.unlinkSync(item.path))
        resolve({ status: true })
      }

    } catch (error) {
      throw (error)
    }
  })
}







module.exports = {
  addCategory,
  loadcategory,
  loadEditCategory,
  viewCategory,
  editCategory,
  deleteCategory,
  addProduct,
  editproduct,
  viewproductsbycategory,
  viewproducts,
  getproduct,
  deleteProduct
}