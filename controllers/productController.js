const products = require("../models/productmodel");
const categorys = require('../models/categorymodel');
const { default: mongoose } = require("mongoose");
const cloudinary = require("../utils/cloudinary")
const cartcount = require("../middleware/cartcount")

const addCategory = async (req, res) => {
  try {
    const category = await categorys.findOne({ title: req.body.category })
    if (category) {
      res.json({ exists: true });
    } else {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const newCategory = new categorys({
        title: req.body.category,
        image: req.file.filename,
        path: result.secure_url,
        cloudinary_id: result.public_id
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
    viewCategory().then((response) => {
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
    let img;
    let imgpath;
    let cloudinaryId;
    if (req.file != null) {
      await cloudinary.uploader.destroy(Category.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      cloudinaryId = result.public_id
      img = req.file.filename
      imgpath = result.secure_url

    } else {
      img = Category.image
      imgpath = Category.path
      cloudinaryId = Category.cloudinary_id

    }
    await categorys.findOneAndUpdate({ _id: req.body.categoryid }, {
      title: req.body.category,
      image: img,
      path: imgpath,
      cloudinary_id: cloudinaryId,
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

  try {
    const category = await categorys.findOne({ _id: req.params.categoryId })
    await cloudinary.uploader.destroy(category.cloudinary_id);
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
  try {
    let pictureFiles = req.files;
    //Check if files exist
    if (!pictureFiles)
      return res.status(400).json({ message: "No picture attached!" });
    //map through images and create a promise array using cloudinary upload function
    let multiplePicturePromise = pictureFiles.map((picture) =>
      cloudinary.uploader.upload(picture.path)
    );
    // await all the cloudinary upload functions in promise.all
    let imageResponses = await Promise.all(multiplePicturePromise);
    const data = req.body
    imageResponses = imageResponses.map((item) => {
      return {
        cloudinary_id: item.public_id,
        path: item.secure_url
      };
    });
    const newProduct = new products({
      name: data.name,
      price: data.price,
      size: data.size,
      images: imageResponses,
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
  try {
    const data = req.body
    let images;
    const product = await products.findOne({ _id: req.body.productId })

    if (req.files != null) {
      let pictureFiles = product.images;
      let multipledeletePicturePromise = pictureFiles.map((picture) =>
        cloudinary.uploader.destroy(picture.cloudinary_id)
      );
      // await all the cloudinary upload functions in promise.all
      await Promise.all(multipledeletePicturePromise);

      //Check if files exist
      if (!pictureFiles)
        return res.status(400).json({ message: "No picture attached!" });
      //map through images and create a promise array using cloudinary upload function
      let multiplePicturePromise = pictureFiles.map((picture) =>
        cloudinary.uploader.upload(picture.path)
      );
      // await all the cloudinary upload functions in promise.all
      let imageResponses = await Promise.all(multiplePicturePromise);
      imageResponses = imageResponses.map((item) => {
        return {
          cloudinary_id: item.public_id,
          path: item.secure_url
        };
      });
      images = imageResponses
    } else {
      images = product.images
    }

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
    const productsdata = await products.find({ category: Category, active: true }).populate({ path: "category" }).lean()

    if (!productsdata.length == 0) {
      category = productsdata[0].category.title
    }
    res.render('users/productByCategory', { productsdata, category, user: req.session.user, totalItems: req.session.cartItemscount })

  } catch (error) {
    throw new Error(error)
  }
}

const viewproducts = (category, sort) => {
  return new Promise(async (resolve, reject) => {

    try {
      let filter = { active: true }
      let sortObject = {}
      if (category) {
        filter["category"] = category
      }
      if (sort) {
        if (sort === "price_asc") {
          sortObject["price"] = 1
        }
        if (sort === "price_desc") {
          sortObject["price"] = -1
        }
      }

      await products.find(filter).sort(sortObject).populate({ path: "category" }).lean().then((data) => {
        resolve({ status: true, data })
      }).catch((error) => {
        throw error;
      })
    } catch (error) {
      res.render("error", { error })
    }

  })
}

const getSingleproduct = async (req, res) => {
  try {
    let totalItems = null;
    if (req.session.user) {
      totalItems = await cartcount.getCartCount(req.session.user._id);
    }
    const productdetails = await products.findOne({ _id: req.params.productID }).populate({ path: "category" }).lean()
    res.render("users/product", { totalItems, user: req.session.user, productdetails });
  } catch (error) {
    res.render("error", { error })
  }
}

const deleteProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let p = await products.find({ _id: data.Id })
      await products.findOneAndUpdate({ _id: data.Id }, { $set: { active: false } })
        .then(() => {
          resolve({ status: true })
        })


    } catch (error) {
      res.render("error", { error })
    }
  })
}

const search = async (req, res) => {
  try {
    let payload = req.body.payload.trim();
    if (!req.body.payload) return
    const [Categorys, Products] = await Promise.all([
      categorys.find({ title: { $regex: new RegExp('^' + payload + '.*', 'i') } }, { title: 1, path: 1 }).lean(),
      products.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } }, { name: 1, images: { $slice: 1 } }).limit(7).lean()])
    res.send({ Categorys, Products })
  } catch (error) {
    res.render("error", { error })
  }
};

const searchResultPage = async (req, res) => {
  try {
    let payload = req.body.search.trim();
    if (!req.body.search) return
    const productsdata = await products.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).limit(7).lean()
    res.render("users/search", { productsdata, query: req.body.search })
  } catch (error) {
    res.render("error", { error })
  }
};



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
  deleteProduct,
  search,
  searchResultPage
}