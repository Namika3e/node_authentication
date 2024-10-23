'use strict';
const { v4: uuidv4 } = require("uuid");
// const genRandomString = require("../../helpers/genString");
const {DataTypes} = require("sequelize")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors_profile', {
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
  
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      name_of_business: {
        type: DataTypes.STRING,
        allowNull: false,
        
      },
      date_of_birth: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('vendors_profile');
  }
};