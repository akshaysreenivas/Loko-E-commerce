// const multer = require('multer')

// // ------product images upload-----  
// // set storage 
// const productImgStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     let ext = file.originalname.substring(file.originalname.lastIndexOf('.'))
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`)
//   }
// })



// module.exports =storage= multer({ storage : productImgStorage })


const multer = require('multer');

// set storage
var storage = multer.diskStorage({
    destination : function ( req , file , cb ){
        cb(null, 'uploads')
    },
    filename : function (req, file , cb){
        // image.jpg
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

        cb(null, file.fieldname+file.originalname + '-' + Date.now() + ext)
    }
})

module.exports = store = multer({ storage : storage })