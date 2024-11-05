const express = require("express");
const vendorAuth = require("../controllers/vendorsAuth.Controller");
const testing = require("../middleware/testing");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary");
const catchMulterErrors = require("../middleware/multer.error");

const router = express.Router();

router.post("/signup", (req, res) => vendorAuth.signup(req, res));
router.post("/signin", (req, res) => vendorAuth.signin(req, res));

module.exports = router;
