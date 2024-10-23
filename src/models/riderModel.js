const { DataTypes } = require("sequelize");
const db = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");
const genRandomString = require("../helpers/genString");

const PHONE_NUM_MIN_DIGITS = 11;
const PHONE_NUM_MAX_DIGITS = 11;

const NIN_LENGTH = 12;

const ACCOUNT_NUM_LENGTH = 10;

const Riders_profile = db.define(
  "Riders_profile",
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
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    method_of_delivery: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    current_location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    currently_working_with_another_logistics: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    NIN: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      validate: {
        isCorrectLength(value) {
          if (value) {
            const length = value.toString().length;
            if (length != NIN_LENGTH) {
              throw new Error("NIN should be 12 digits");
            }
          }
        },
      },
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    account_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      validate: {
        isCorrectLength(value) {
          if (value) {
            const length = value.toString().length;
            if (length != ACCOUNT_NUM_LENGTH) {
              throw new Error(
                `Account number must not be more or less than 10 digits.`
              );
            }
          }
        },
      },
    },
    guarantor_1_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    guarantor_1_phone_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      validate: {
        isCorrectLength(value) {
          if (value) {
            const length = value.toString().length;
            if (
              length < PHONE_NUM_MIN_DIGITS ||
              length > PHONE_NUM_MAX_DIGITS
            ) {
              throw new Error(`Phone number must have no more than 11 digits.`);
            }
          }
        },
      },
    },
    guarantor_2_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    guarantor_2_phone_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      validate: {
        isCorrectLength(value) {
          if (value) {
            const length = value.toString().length;
            if (
              length < PHONE_NUM_MIN_DIGITS ||
              length > PHONE_NUM_MAX_DIGITS
            ) {
              throw new Error(`Phone number must have no more than 11 digits`);
            }
          }
        },
      },
    },
    agreed_to_regular_updates: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accepted_privacy_policy: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // is_account_verified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    //   allowNull:false
    // },

    // is_account_activated_by_admin: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    //   allowNull:false
    // },

    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    vehicle_img: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    mode_of_identification_img: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    signup_upload_temp_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: genRandomString(6),
    },
    public_unique_Id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
  },

  {
    indexes: [
      { unique: true, fields: ["public_unique_Id", "firstname", "lastname"] },
    ],
    tableName: "riders_profile",
    timestamps: true,
  }
);

module.exports = Riders_profile;
