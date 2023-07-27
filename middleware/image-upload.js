
// const multer = require('multer');

// // set storage

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/images')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
//     }
// })


// //Upload Setting
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (
//             file.mimetype == 'image/jpeg' ||
//             file.mimetype == 'image/jpg'  ||
//             file.mimetype == 'image/png'  ||
//             file.mimetype == 'image/gif'  ||
//             file.mimetype == 'image/webp'

//         ) {
//             cb(null, true)
//         }
//         else {
//             cb(null, false);
//             cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
//         }
//     }
// })

// module.exports = upload;

const multer = require("multer");
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});