const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const AppError = require("../utils/error.utils.js");
const userRepository = require("../repositories/userRepository.js");
const { uploadOnCloudinary } = require("../middleware/cloudinary.js");
const sendEmail = require("../utils/sendemail.js");
const generateOtp = require("../utils/generateOtp.js");
const sendSms = require("../utils/sendSms.js");
const crypto = require("crypto");

class UserService {


  async getUserById(findById)
  {
    const user = await userRepository.findById(findById)
    if(!user)
    {
      throw new AppError("User not found", 400);
    }

    user.password=undefined;
    return user;
  }
  
  async registerUser(data, file) {
    let { name, username, email, phoneNumber, password, confirmPassword, address, pincode, state } = data;
    
    phoneNumber = "+91" + phoneNumber;

    if (!name || !username || !email || !phoneNumber || !address || !pincode || !state || !password || !confirmPassword) {
      throw new AppError("All fields required", 400);
    }

    if (!emailValidator.validate(email)) {
      throw new AppError("Invalid Email", 400);
    }

    if (await userRepository.findByEmail(email)) {
      throw new AppError("Use another email. This email is already used", 400);
    }

    if (await userRepository.findByUsername(username)) {
      throw new AppError("Username not available", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Password and Confirm Password don't match", 400);
    }

    let localFilePath = file ? file.path : "default-avatar.jpg";  // Default fallback if no file is provided
    const folderName = "OnlineGroceryStore/userAvatar";

    const response = await uploadOnCloudinary(localFilePath, folderName);
    
    const user = await userRepository.createUser({
      name, username, email, phoneNumber, password, pincode, address, state,
      avatar: response ? { public_id: response.public_id, url: response.url } : {}
    });

    return user;
  }

  async loginUser(identifier, password) {
    if (!identifier || !password) {
      throw new AppError("Identifier (username, email, or phone number) and password are required", 400);
    }

    const user = await userRepository.findByEmail(identifier) || 
                 await userRepository.findByUsername(identifier) ||
                 await userRepository.findByPhoneNumber(identifier);

    console.log(user)

    if (!user) {
      throw new AppError("User doesn't exist", 404);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    console.log(checkPassword);
  
    if (!checkPassword) {
      throw new AppError("Invalid Credentials", 400);
    }
    
    
      const token = await user.jwtToken();
      user.password = undefined;

      const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Lax' // or 'Strict'
    };
      
    return {user,token,cookieOptions};
  }

  async updateUserProfile(userId, data, file) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    Object.assign(user, data);
    if (data.phoneNumber) user.phoneNumber = "+91" + data.phoneNumber;

    if (file) {
      const response = await uploadOnCloudinary(file.path, "OnlineGroceryStore/userAvatar");
      user.avatar = { public_id: response.public_id, url: response.url };
    }

    await userRepository.updateUser(user);
    return user;
  }


  async forgetPassword(email,req){
    const user = await userRepository.findByEmail(email);
    if (!user) {
        return next(new AppError("User not found",404))
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
  

    // Set token and expiration time
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 900000; // 15 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`;
    
    // Message to be sent
    const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
      html: `<b>${message}</b>`
    });

    // return message;

  }

  async sendOtp(phoneNumber, email) {
    const user = await userRepository.findByPhoneNumber(phoneNumber);
    if (!user) throw new AppError("User not found", 404);

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await userRepository.updateUser(user);

    // await sendSms(user.phoneNumber, `Your OTP is ${otp}. It is valid for 10 minutes.`);
    // await sendEmail({ to: email || user.email, subject: "Your OTP Code", text: `Your OTP is ${otp}. It is valid for 10 minutes.` });

    const smsMessage = `Your OTP is ${otp}. It is valid for 10 minutes.`;
    await sendSms(user.phoneNumber, smsMessage);

      // Message to be sent via Email
      const emailMessage = `Your OTP is <b>${otp}</b>. It is valid for 10 minutes.`;
      await sendEmail({
        to: email || user.email, // Use provided email or default to user's email
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        html: emailMessage
      });

    return "OTP sent successfully";
  }

  async verifyOtp(phoneNumber, email, otp, password) {
    const user = await userRepository.findByPhoneNumber(phoneNumber) || await userRepository.findByEmail(email);
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;
    await userRepository.updateUser(user);

    return "OTP verified successfully";
  }
}

module.exports = new UserService();
