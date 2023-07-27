// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports=cloudinary

/////////////////////////
// Uploads an image file
/////////////////////////
// const uploadImage = async (req, res) => {

//     // Use the uploaded file's name as the asset's public ID and 
//     // allow overwriting the asset with new versions
//     const options = {
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true,
//     };

//     try {
//         let filePath;
//         let fileName;
//         if (req.file) {
//             fileName = req.file.filename
//             filePath = `${req.file.path}`;
//         }
//         // Upload the image
//         const result = await cloudinary.uploader.upload(filePath, options);
//         console.log(result);
//         return result.public_id;
//     } catch (error) {
//         console.error(error);
//     }
// };

