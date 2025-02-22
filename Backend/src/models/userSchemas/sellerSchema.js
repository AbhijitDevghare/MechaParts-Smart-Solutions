const SellerSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true
     }, // Seller is linked to User
    shopName: { 
        type: String, 
        required: true 
      },
    shopAddress: String,
    gstNumber: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    totalSales: { 
      type: Number, 
      default: 0 
    },
    ratings: { 
      type: Number, 
      default: 0 
    },
    products: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product" 
      }]
  }, { timestamps: true });
  
  const Seller = mongoose.model("Seller", SellerSchema);
  module.exports = Seller;
  