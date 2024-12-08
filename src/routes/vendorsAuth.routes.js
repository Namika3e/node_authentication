const express = require("express");
const vendorAuth = require("../controllers/vendorsAuth.Controller");
const testing = require("../middleware/testing");

const path = require("path");


const router = express.Router();

router.post("/signup", (req, res) => vendorAuth.signup(req, res));
router.post("/signin", (req, res) => vendorAuth.signin(req, res));
router.post("/forgot_password", (req,res) => vendorAuth.forgotPassword(req,res))
router.get("/validate_reset_token/:token", (req, res) => vendorAuth.validateResetToken(req, res));
router.post("/reset_password/:token", (req,res) => vendorAuth.resetPassword(req,res))

module.exports = router;
