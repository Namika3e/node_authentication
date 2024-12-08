const { sequelize, vendorModel } = require("../sequelize/models");
const JWT = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const responseHandler = require("../handlers/response.handler");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const sendEmail = require("../config/mailer");
const randomString = require("../helpers/randomString");

const randomPassword = randomString();

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
      const hasshedPassword = await bcrypt.hash(randomPassword, 12);
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
          password: hasshedPassword,
        },
        { transaction: t }
      );
      console.log(newVendor);

      const data = await vendorModel.findOne({
        where: { email: email },
        transaction: t,
      });
      const message = `your password is ${randomPassword}`;
      await sendEmail({
        receiverEmail: data.email,
        subject: "Email Verification",
        message: message,
      });
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

  static async signin(req, res) {
    try {
      const { email, password } = req.body;

      const vendor = await vendorModel.findOne({
        where: { email: email },
      });
      const { dataValues } = vendor;

      if (!vendor) {
        return res
          .status(400)
          .json({ success: "false", message: "Incorrect email or password" });
      }

      const valid = await bcrypt.compare(password, vendor.password);

      if (!valid) {
        return res
          .status(400)
          .json({ success: "false", message: "Incorrect email or password" });
      }

      const PUID = dataValues.public_unique_Id;
      const accessToken = JWT.sign(
        { PUID },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { algorithm: "HS256", expiresIn: "1d" }
      );

      const accessTokenCookie = res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      // const refreshToken = JWT.sign({}, process.env.REFRESH_TOKEN_SECRET_KEY, {
      //   expiresIn: "1d",
      //   algorithm: "HS256",
      // });

      // const refreshTokenCookie = res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      // });

      return res.status(200).json({ success: "true" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await vendorModel.findOne({
        where: { email: email },
      });
      console.log(user, "user");
      if (user) {
        const emailToken = JWT.sign(
          { email },
          process.env.FORGOT_PASSWORD_SECRET,
          {
            expiresIn: "10s",
            algorithm: "HS256",
          }
        );
        const message = `Follow the link to reset your password. This link is valid for 10 minutes \n
        ${process.env.CLIENT_FRONTEND_URL}/client/vendor/reset_password/${emailToken} \n 
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
        const updatePassword = await vendorModel.update(
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

module.exports = vendorsAuth;
