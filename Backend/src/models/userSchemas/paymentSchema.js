const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    paymentMethod: { type: String, enum: ["Credit Card", "UPI", "Net Banking", "Cash on Delivery"] },
    transactionId: String,
    amountPaid: Number,
    paymentStatus: { type: String, enum: ["Success", "Failed", "Pending"] }
  }, { timestamps: true });
  
  const Payment = mongoose.model("Payment", PaymentSchema);
  module.exports = Payment;
  