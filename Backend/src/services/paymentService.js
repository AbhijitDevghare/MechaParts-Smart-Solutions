const Razorpay = require("razorpay");
const crypto = require("crypto")


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAYKEYID, // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAYKeySecret, // Replace with your Razorpay Key Secret
  });

class PaymentService
{
    async 
}