require("dotenv").config();
const AppError = require('../utils/error.utils.js');
const User = require("../model/userSchema.js")

const isAdminCheck =async (req, res, next) => {
    try{
        const userId = req.user.id;
        console.log("IS ADMIN CHECK : ",userId)
        const userObj = await User.findById(userId);
   
        if(!(userObj.role==="admin"))
        {
            return next(new AppError("Not Authorized User",400));
        }

        console.log("IS ADMIN CHECKEDDDD");
        next();

    }catch(err)
    {
        return next(new AppError(err.message,400));
    }
};

module.exports = isAdminCheck;
