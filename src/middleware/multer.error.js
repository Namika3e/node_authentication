const multer = require("multer");
const responseHandler = require("../handlers/response.handler")
const catchMulterErrors = (err, req, res, next) => {
   if (err instanceof multer.MulterError) {
       return responseHandler.clientError(res, err.message)
     }
     res.status(500).json({ error: 'An unexpected error occurred' });

}


module.exports = catchMulterErrors
  