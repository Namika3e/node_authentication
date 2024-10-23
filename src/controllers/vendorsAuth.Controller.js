const { sequelize, vendorModel } = require("../sequelize/models");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const responseHandler = require("../handlers/response.handler");
// const sequelize = require("../config/dbConfig");
require("dotenv").config();

class vendorsAuth {
  static async signup(req, res) {
    const t = await sequelize.transaction();  
    const {
      firstname,
      lastname,
      name_of_business,
      email,
      phone_number,
      legal_business_address,
      agreed_to_regular_updates,
      accepted_privacy_policy,
    } = req.body;
    try {
      const newVendor = await vendorModel.create(
        {
          firstname: firstname,
          lastname: lastname,
          name_of_business: name_of_business,
          email: email,
          phone_number: phone_number,
          legal_business_address: legal_business_address,
          agreed_to_regular_updates: agreed_to_regular_updates,
          accepted_privacy_policy: accepted_privacy_policy,
        },
        { transaction: t }
      );
      console.log(newVendor);

      // if (newVendor) {
      //   const data = await VendorModel.findOne({
      //     attributes: ["signup_upload_temp_id"],
      //     where: { email: email },
      //     transaction: t,
      //   });

      //   if (data) {
      //     const tempId = data.signup_upload_temp_id;
      //     console.log(data, "usedrftgyhbvcf");
      //     this.setCookieForImmediateUpload(req, res, tempId);
      //   }
      // }

      await t.commit();
      return responseHandler.created(res);
    } catch (error) {
      console.log(error);
      await t.rollback();
      const validationType = error.errors.map((err) => err.type);
      console.log(validationType[0], "this is type");
      if (
        error.name === "SequelizeValidationError" ||
        validationType[0] === "Validation error"
      ) {
        const validationErrors = error.errors.map((err) => err.message);
        console.log(validationErrors, "val errrorororororo");
        return res.status(400).json({
          SUCCESS: false,
          MESSAGE: validationErrors[0],
          ERROR_TYPE: "Validation error",
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        const uniqueError = error.errors.map((err) => err.message);
        return res.status(409).json({
          SUCCESS: false,
          MESSAGE: uniqueError[0],
          ERROR_TYPE: "unique constraint error",
        });
      }

      return res.status(500).json({
        SUCCESS: false,
        MESSAGE: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
}

module.exports = vendorsAuth;
