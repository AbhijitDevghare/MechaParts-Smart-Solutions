const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }],
    totalAmount: Number,
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
    shippingAddress: String,
    trackingNumber: String
  }, { timestamps: true });
  
  const Order = mongoose.model("Order", OrderSchema);
  module.exports = Order;
  