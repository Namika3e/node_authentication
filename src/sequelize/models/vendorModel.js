"use strict";
const { v4: uuidv4 } = require("uuid");
const genRandomString = require("../../helpers/genString");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vendorModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  const PHONE_NUM_MIN_DIGITS = 11;
  const PHONE_NUM_MAX_DIGITS = 11;
  vendorModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
          args: true,
          msg: "Phone number already in use",
        },
        validate: {
          isCorrectLength(value) {
            if (value) {
              const length = value.toString().length;
              if (
                length < PHONE_NUM_MIN_DIGITS ||
                length > PHONE_NUM_MAX_DIGITS
              ) {
                throw new Error(
                  `Phone number must have no more than 11 numbers.`
                );
              }
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email already in use",
        },
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [8, 100], // Ensure password is between 8 and 100 characters
          isStrongPassword(value) {
            if (value) {
              if (
                !/[a-z]/.test(value) ||
                !/[A-Z]/.test(value) ||
                !/[0-9]/.test(value) ||
                !/[^a-zA-Z0-9]/.test(value)
              ) {
                throw new Error(
                  "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
                );
              }
            }
          },
        },
        defaultValue: null,
      },
      name_of_business: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notFutureDate(value) {
            if (value) {
              const enteredDate = new Date(value);
              const today = new Date();
              if (enteredDate > today) {
                throw new Error("Date of birth cannot be a future date");
              }
            }
          },

          // notOldEnough(value) {
          //   if (value) {
          //     const enteredDate = new Date(value)
          //     const enteredYear = enteredDate.getFullYear()
          //     const today = new Date();
          //     const ageCutoff = new Date(
          //       today.setFullYear(today.getFullYear() - 18)
          //     );
          //     if (enteredYear > ageCutoff) {
          //       throw new Error("You must be at least 18 years old");
          //     }
          //   }
          // },
        },
        defaultValue: null,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      legal_business_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_of_business: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      tax_identification_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      signup_upload_temp_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      public_unique_Id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      agreed_to_regular_updates: {
        type: DataTypes.BOOLEAN,
      },
      accepted_privacy_policy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "vendorModel",
      tableName: "vendors_profile",
    }
  );
  return vendorModel;
};
