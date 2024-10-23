"use strict";
const genRandomString = require("../helpers/genString");
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riders_profile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
  
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      date_of_birth: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      method_of_delivery: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      current_location: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      profile_photo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      currently_working_with_another_logistics: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      NIN: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      account_number: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      guarantor_1_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      guarantor_1_phone_number: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      guarantor_2_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      guarantor_2_phone_number: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      vehicle_img: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      mode_of_identification_img: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      signup_upload_temp_id: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: genRandomString(5),
      },
      public_unique_Id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      agreed_to_regular_updates: {
        type: Sequelize.BOOLEAN,
      },
      accepted_privacy_policy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("riders_profile");
  },
};
