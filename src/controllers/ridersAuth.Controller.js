const { sequelize, riderModel } = require("../sequelize/models");
const JWT = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const responseHandler = require("../handlers/response.handler");
const bcrypt = require("bcrypt");
const randomString = require("../helpers/randomString");
const sendEmail = require("../config/mailer");
require("dotenv").config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const randomPassword = randomString();
class RidersAuth {
  //signup handler
  static async signup(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        firstname,
        lastname,
        phone_number,
        email,
        // password,
        // date_of_birth,
        // gender,
        // country,
        // state,
        // method_of_delivery,
        // resident_location,
        // currently_working_with_another_logistics,
        // NIN,
        // bank_name,
        // account_number,
        // guarantor_1_name,
        // guarantor_1_phone_number,
        // guarantor_2_name,
        // guarantor_2_phone_number,
        agreed_to_regular_updates,
        accepted_privacy_policy,
      } = req.body;

      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      const newRider = await riderModel.create(
        {
          firstname: firstname,
          lastname: lastname,
          phone_number: phone_number,
          email: email,
          // date_of_birth: date_of_birth,
          password: hashedPassword,
          // gender: gender,
          // country: country,
          // state: state,
          // method_of_delivery: method_of_delivery,
          // current_location: resident_location,
          // currently_working_with_another_logistics:
          //   currently_working_with_another_logistics,
          // NIN: NIN,
          // bank_name: bank_name,
          // account_number: account_number,
          // guarantor_1_name: guarantor_1_name,
          // guarantor_1_phone_number: guarantor_1_phone_number,
          // guarantor_2_name: guarantor_2_name,
          // guarantor_2_phone_number: guarantor_2_phone_number,
          agreed_to_regular_updates: agreed_to_regular_updates,
          accepted_privacy_policy: accepted_privacy_policy,
        },
        { transaction: t }
      );
      console.log(newRider, "new riderrrrrrrr");

      if (newRider) {
        const data = await riderModel.findOne({
          attributes: ["signup_upload_temp_id"],
          where: { email: email },
          transaction: t,
        });

        if (data) {
          const tempId = data.signup_upload_temp_id;
          this.setCookieForImmediateUpload(req, res, tempId);
        }
      }
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
  } //end of signup

  // multer setup for img upload
  static multerSetup() {
    return multer.memoryStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
      },
    });
  }

  //image upload handler
  static async uploadToCloudinaryAndDatabase(req, res) {
    try {
      const files = req.files;
      const cookie = req.cookies;
      console.log(cookie, "FE cookie");
      console.log(files, "files also");
      console.log(req.body, "body also");
      const tempId = cookie ? req.cookies.temp_Id : "";

      // Upload each file to Cloudinary
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "havesta_signup_uploads",
            },
            (error, result) => {
              if (error) {
                console.log(error, "reject error");
                reject(error, "error uploading image");
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      if (uploadResults && tempId) {
        const riderVehicle = uploadResults[0];
        const riderModeOfId = uploadResults[1];
        await this.saveUploadURLToDb(tempId, riderVehicle, riderModeOfId, res);
      }
    } catch (error) {
      console.log(error, "coudinary error");
      return responseHandler.serverError(res, error.message);
    }
  }

  //function to save cloudinary url to database
  static async saveUploadURLToDb(tempId, vehicleImg, modeOfIdImg, res) {
    const t = await sequelize.transaction();
    try {
      const data = await riderModel.findOne({
        where: { signup_upload_temp_id: tempId },
        transaction: t,
      });
      const newData = {
        mode_of_identification_img: modeOfIdImg,
        vehicle_img: vehicleImg,
      };
      if (data) {
        const saveURLToDb = await riderModel.update(newData, {
          where: { signup_upload_temp_id: tempId },
          transaction: t,
        });
        this.deleteSignupTempIdFromDB(tempId);
      }

      const message = `your password is ${randomPassword}`;
      await sendEmail({
        receiverEmail: data.email,
        subject: "Email Verification",
        message: message,
      });
      await t.commit();
      res.clearCookie("temp_Id");
      return responseHandler.created(res);
    } catch (error) {
      console.log("from saveUpload blah blah");
      await t.rollback();
      return responseHandler.serverError(res);
    }
  }

  //cookie setter
  static setCookieForImmediateUpload(req, res, tempId) {
    try {
      const cookie = res.cookie("temp_Id", tempId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    } catch (err) {
      console.log(err, "error");
    }
  }

  static async deleteSignupTempIdFromDB(tempId) {
    try {
      const newData = {
        signup_upload_temp_id: null,
      };
      const deleteTempId = await riderModel.update(newData, {
        where: { signup_upload_temp_id: tempId },
      });
      console.log(deleteTempId);
    } catch (err) {
      return;
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;

      const rider = await riderModel.findOne({
        where: { email: email },
      });

      if (!rider) {
        responseHandler.notfound(res, "Incorrect Email or Password");
      }

      const valid = await bcrypt.compare(password, rider.password);

      if (!valid) {
        responseHandler.notfound(res, "Incorrect Email or Password");
      }

      const secret = fs.readFileSync("./src/certs/private.pem");

      const payload = { PUID: rider.public_unique_id };

      const authToken = JWT.sign(payload, secret, {
        expiresIn: "15m",
        algorithm: "RS256",
      });

      try {
        const cookie = res.cookie("authToken", authToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      } catch (err) {
        console.log(err, "error setting cookie");
      }

      return res.status(200).json({ message: "logged in!" });
    } catch (error) {
      return res.status(500).json({ error: "error", error });
    }
  }

  static async getRefreshToken() {
    const uniqueId = rider.public_unique_id;
    const refreshToken = JWT.sign();
  }
}

module.exports = RidersAuth;
