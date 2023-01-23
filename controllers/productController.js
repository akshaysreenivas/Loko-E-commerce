const products = require("../models/productmodel");
const categorys = require('../models/categorymodel');
const fs = require('fs');
const path = require("path");
const { default: mongoose } = require("mongoose");


const addCategory = async (req, res) => {
 
  console.log("hbhj")
  try {
    let filePath;
    let fileName;
    if(req.file){
      fileName=req.file.filename
       filePath = `${req.file.path}`;
    }
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
    const category = await categorys.find({ _id: req.params.categoryId }).lean();
    let Category;
    if (category) {
     Category = category[0]
    }
    res.render("admin/editcategory", { Category })
  } catch (error) {
    throw error
  }
}

const editCategory = async (req, res) => {
  try {
    const Category = await categorys.findOne({ _id: req.body.categoryid });
    const filePath = Category.path
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
  const filePath = `public/images/${req.params.imgpath}`
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
    const Categorys = await categorys.find({}).lean();
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
  const data = req.body
  try {
    const newProduct = new products({
      name: data.name,
      price: data.price,
      size: data.size,
      images: req.files,
      selling_price: data.sellingPrice,
      category: mongoose.Types.ObjectId(data.category),
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
  const data = req.body
  let images;
  const product = await products.findOne({ _id: req.body.productId })

  product.images.map(item => fs.unlinkSync(item.path))
  if (req.files != null) {
    images = req.files
  } else {
    images = product.images
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
    const Category = new mongoose.Types.ObjectId(req.params.category)
    let category = null
    const productsByCategory = await products.find({ category: Category }).populate({ path: "category" }).lean()
    const productsdata = productsByCategory.map((data) => {
      return {
        _id: data._id,
        name: data.name,
        price: data.price,
        image: data.images[0].filename
      };
    });
    if (!productsByCategory.length == 0) {
      category = productsByCategory[0].category.title
    }
    res.render('users/productByCategory', { productsdata, category, user: req.session.user, totalItems: req.session.cartItemscount })

  } catch (error) {
    throw error;
  }

}

const viewproducts = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await products.find({}).populate({ path: "category" }).lean().then((data) => {
        resolve({ status: true, data })
      }).catch((error) => {
        throw error;
      })
    } catch (error) {
      throw error;
    }

  })
}

const getSingleproduct = async (req, res) => {
  try {
    let image;
    const product = await products.findOne({ _id: req.params.productID }).populate({ path: "category" }).lean()
    if (product) {
      image = product.images[0].filename
    }
    res.render("users/product", { user: req.session.user, product, image });
  } catch (error) {
    res.render("error", { error })
  }
}

const deleteProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedproduct = await products.findOneAndDelete({ _id: data.Id }, { rawResult: true })
      if (deletedproduct) {

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
  getSingleproduct,
  deleteProduct
}