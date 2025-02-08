require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Logger
app.use(morgan('dev'));

// Database Connection
const connectToDb = require('./config/configDb.js');
connectToDb();

// Routes
const routes = require("./routers/v1/");
app.use('/api/v1', routes);

// app.use('/',(req,res)=>{
//   res.json({
//     message:"WELCOCME TO THE HOME HERO"
//   })
// })

// Error handling middleware
const errorMiddleware = require("./middleware/error.middleware.js");
app.use(errorMiddleware);

// Serve static files (images)
app.use('/Images', express.static(path.join(__dirname, "Images"))); // http://yourdomain.com/Images/photo.jpg


module.exports = app;
