const express = require("express");
const RidersAuth = require("../controllers/ridersAuth.Controller");
const testing  = require("../middleware/testing")
const multer = require("multer")
const path = require("path")
const cloudinary = require("cloudinary")
const catchMulterErrors = require("../middleware/multer.error")

const router = express.Router();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname, '../../uploads'));
//     },
//     filename: (req,file,cb) => {
//       cb(null, `${Date.now()}${path.extname(file.originalname)}` )
//     }
//   });
  const upload = multer({ storage: RidersAuth.multerSetup(), limits: { fileSize: 2 * 1024 * 1024 }, });

  // const uploadArray  = (name ,number) => {
  //   return upload.array(name, number) (req,res, function(err) {
  //     console.log(err, 'multeez error')
  //   })
  // }


router.post("/signup", testing, (req, res) => RidersAuth.signup(req, res));
router.post("/upload",  upload.fields([{name:'vehicle_image',maxCount:1 },{name:'ID_image',maxCount:1 } ]), catchMulterErrors, (req,res)=>RidersAuth.uploadToCloudinaryAndDatabase(req,res))
router.post("/signin", (req, res) => RidersAuth.signin(req, res));
router.post("/forgot_password", (req,res) => RidersAuth.forgotPassword(req,res))
router.get("/validate_reset_token/:token", (req, res) => RidersAuth.validateResetToken(req, res));
router.post("/reset_password/:token", (req,res) => RidersAuth.resetPassword(req,res))


module.exports = router;
