const { sequelize, riderModel } = require("../sequelize/models");
const JWT = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const responseHandler = require("../handlers/response.handler");
const bcrypt = require("bcryptjs");
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

      if (newRider) {
        const data = await riderModel.findOne({
          attributes: ["signup_upload_temp_id"],
          where: { email: email },
          transaction: t,
        });

        if (data) {
          const tempId = data.signup_upload_temp_id;
          this.setCookieForImmediateUpload(req, res, tempId);
          const message = `your password is ${randomPassword}`;
          await sendEmail({
            receiverEmail: email,
            subject: "Email Verification",
            message: message,
          });
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
      const arrFile = Array.from(Object.entries(files));
      const cookie = req.cookies;
      console.log(cookie, "FE cookie");
      console.log(files, "files also");
      console.log(req.body, "body also");
      const tempId = cookie ? req.cookies.temp_Id : "";
      const uploadPromises = [];

      for (const [fieldName, files] of Object.entries(req.files)) {
        files.forEach((file) => {
          uploadPromises.push(
            new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  resource_type: "image",
                  folder: "havesta_rider_images",
                  public_id: `${fieldName}-${Date.now()}`,
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
              const stream = streamifier.createReadStream(file.buffer);
              stream.pipe(uploadStream);
            })
          );
        });
      }
      const data = await Promise.all(uploadPromises);
      if (data && tempId) {
        const riderVehicle = data[0].public_id.includes("vehicle_image")
          ? data[0].secure_url
          : data[1].secure_url;
        const riderModeOfId = data[1].public_id.includes("ID_image")
          ? data[1].secure_url
          : data[0].secure_url;
        await this.saveUploadURLToDb(tempId, riderVehicle, riderModeOfId, res);
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }
    } catch (error) {
      console.log(error, "coudinary error");
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
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

      await t.commit();
      res.clearCookie("temp_Id");
      return res
        .status(201)
        .json({ success: true, message: "Operation Successful" });
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

  // static async deleteSignupTempIdFromDB(tempId) {
  //   try {
  //     const newData = {
  //       signup_upload_temp_id: null,
  //     };
  //     const deleteTempId = await riderModel.update(newData, {
  //       where: { signup_upload_temp_id: tempId },
  //     });
  //     console.log(deleteTempId);
  //   } catch (err) {
  //     return;
  //   }
  // }

  static async signin(req, res) {

    
    try {
      const { email, password } = req.body;

      const rider = await riderModel.findOne({
        attributes: ["password"],
        where: { email: email },
      });
      console.log(rider, "rider")
      if (!rider) {
        return responseHandler.notfound(res, "Incorrect Email or Password");
      }

      const valid = await bcrypt.compare(password, rider.dataValues.password);

      if (!valid) {
        return responseHandler.notfound(res, "Incorrect Email or Password");
      }

      const accessToken = JWT.sign(
        { PUID: rider.public_unique_id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { algorithm: "HS256", expiresIn: "15m" }
      );


      const accessTokenCookie = res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,//for development only. Set to true in production
        sameSite: "none" //  Set to lax or strict in production if your client and server are on the same domain.
      });



      return res.status(200).json({ success: "true" });
    } catch (error) {
      console.log(error, "error")
      return res.status(500).json({ error });
      
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await riderModel.findOne({
        where: { email: email },
      });
      console.log(user, "user");
      if (user) {
        const emailToken = JWT.sign(
          { email },
          process.env.FORGOT_PASSWORD_SECRET,
          {
            expiresIn: "10m",
            algorithm: "HS256",
          }
        );
        const message = `Follow the link to reset your password. This link is valid for 10 minutes \n
        ${process.env.CLIENT_FRONTEND_URL}/client/rider/reset_password/${emailToken} \n 
        If you did not make a password reset request, please ignore this email`;

        await sendEmail({
          receiverEmail: email,
          subject: "Email Verification",
          message: message,
        });
        return res.status(200).json({ success: true, message: "Email sent" });
      } else if (user === null) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Email is not associated with an account, enter a correct email",
          });
      }
    } catch (err) {
      console.log(err, "err");

      return res.status(500).json("something went wrong");
    }
  }

  static async validateResetToken(req, res) {
    const { token } = req.params;
    try {
      const isTokenValid = JWT.verify(
        token,
        process.env.FORGOT_PASSWORD_SECRET
      );

      if (isTokenValid) {
        return res.status(200).json({ valid: true, message: "token is valid" });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ valid: false, message: "Token has expired" });
      } else {
        res.status(400).json({ valid: false, message: "Invalid token" });
      }
    }
  }

  static async resetPassword(req, res) {
    const t = await sequelize.transaction();
    const token = req.params.token;
    const { email } = JWT.verify(token, process.env.FORGOT_PASSWORD_SECRET);
    const { newPassword, confirmPassword } = req.body;
    
    try {
      if (newPassword === confirmPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12)
        const updatePassword = await riderModel.update(
          { password: hashedPassword},
          {
            where: { email: email },
            transaction: t,
          }
        );
      } else return res.status(400).json({success:false, message: "passwords do not match"})

      await t.commit();
      return res.status(200).json({success:true, message:"Password change successful"})
    } catch (error) {
      await t.rollback();
      console.log(error, "error")

      return res.status(500).json({success:false, message:"Password change unsuccessful"})
    }
  }


}

module.exports = RidersAuth;
