require("dotenv").config();
const JWT = require('jsonwebtoken');
const AppError = require('../utils/error.utils.js');


const jwtAuth = (req, res, next) => {
    const token = req.cookies?.token || null;
    // console.log("PRINTING TOKEN:", token);

    if (!token) {
        return next(new AppError("Not Authorized: No token provided",401));
    }

    try {
        // Verify JWT token
        const payload = JWT.verify(token, process.env.SECRET);
        // console.log("Token verified, user payload:", payload);

        // Attach user info to the request object
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (error) {
        // console.error("Token verification error:", error.message);
        return next(new AppError(`Not Authorized : ${error.message}`,401))
    }
};

module.exports = jwtAuth;
