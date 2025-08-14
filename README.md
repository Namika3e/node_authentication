# 🚀 Riders Authentication API  
*A secure Node.js microservice featuring JWT auth, Redis, PostgreSQL, and rate-limiting, with image upload*  

[![ISC License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js->=18-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-blue.svg)](https://www.postgresql.org/)


## 📌 Table of Contents  
- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Installation](#-installation)  


## ✨ Features  
- 🔐 **JWT Authentication** with bcrypt password hashing  
- 🗄️ **PostgreSQL** database with Sequelize ORM   
- 📧 **Email integration** via Nodemailer  
- 📁 **File uploads** to Cloudinary with Multer  
- 🛡️ **Security** with Helmet, CORS, and rate-limiting  
- ⏰ **Scheduled tasks** using node-cron  

## 🛠️ Tech Stack  
- **Runtime**: Node.js 18+  
- **Framework**: Express  
- **Database**: PostgreSQL + Sequelize  
- **File Storage**: Cloudinary  
- **Security**: JWT, Helmet, express-rate-limit  

## ⚙️ Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Namika3e/node_authentication.git
   cd node_authentication

 2. Install dependencies:
    ```bash
    npm install

3. Set up environment variables (create .env file):
   ```env
   PORT=3000
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
4. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
5. Start the server:
   ```bash
   npm run dev  # Development (with nodemon)
   npm start    # Production
