// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;

// const app = express();

// // Configure Multer
// // const storage = multer.memoryStorage(); // Store files in memory as buffers
// // const upload = multer({ storage: storage });

// // // Configure Cloudinary
// // // cloudinary.config({
// // //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// // //   api_key: process.env.CLOUDINARY_API_KEY,
// // //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // // });
// // cloudinary.config({
// //     cloud_name: 'djgmc23z2',
// //     api_key: '314956567655758',
// //     api_secret: 'XJuJ1tJ_5iaCCwBwDG2sWEDWwyM'
// //   })

// // // Function to upload a single file to Cloudinary
// // const uploadToCloudinary = (fileBuffer) => {
// //   return new Promise((resolve, reject) => {
// //     const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
// //       if (error) {
// //         reject(error);
// //       } else {
// //         resolve(result);
// //       }
// //     });
// //     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
// //   });
// // };

// // // Express route to handle the file uploads
// // app.post('/upload', upload.array('images', 10), async (req, res) => {
// //   try {
// //     const uploadPromises = req.files.map((file) => {
// //       return uploadToCloudinary(file.buffer);
// //     });

// //     const results = await Promise.all(uploadPromises);
// //     res.json({ files: results });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Failed to upload images' });
// //   }
// // });

// // // Start the Express server
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

// app.post("/upload", upload.array("images"), async (req, res) => {
//   try {
//     const files = req.files;

//     // Upload each file to Cloudinary
//     const uploadPromises = files.map((file) => {
//       return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             resource_type: "image",
//             folder: "havesta_signup_uploads",
//           },
//           (error, result) => {
//             if (error) reject(error, "error uploading image");
//             else {
//               resolve(result.secure_url);
//             }
//           }
//         );
//         uploadStream.end(file.buffer)
//       });

//     });

//     // Wait for all uploads to complete
//     const uploadResults = await Promise.all(uploadPromises);

//     // Respond with the uploaded image URLs
//     res.status(200).json({ urls: uploadResults });
//   } catch (error) {
//     console.log(error.message, "error message")
//     res.status(500).json({ error: "Image upload failed"});
//   }
// });
