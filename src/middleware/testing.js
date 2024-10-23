const testing = (req,res,next) => {
    console.log("testing middleware")
    next();
}

module.exports = testing;