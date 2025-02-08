class PaymentController
{

    static async createOrder(req, res) {
    try {
      const { amount, currency } = req.body; // Amount in smallest currency unit, e.g., paise for INR
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert amount to paise
        currency: currency || 'INR',
        receipt: `receipt_${Date.now()}`, // Unique receipt ID
      });
      res.status(200).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Unable to create order' });
    }
  }

  

  static async verifyPayment(req, res) {

    const secretKey = process.env.RAZORPAYKeySecret;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const generated_signature = crypto
      .createHmac('sha256', secretKey) // Replace with Razorpay Key Secret
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
  
    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  }

}

module.exports = PaymentController;
