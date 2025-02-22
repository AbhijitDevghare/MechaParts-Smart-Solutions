const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    discountPrice: Number,
    brand: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    stockQuantity: Number,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    images: [String],
    sku: String,
    warrantyPeriod: String,
    returnable: Boolean
  }, { timestamps: true });
  
  const Product = mongoose.model("Product", ProductSchema);
  module.exports = Product;
  