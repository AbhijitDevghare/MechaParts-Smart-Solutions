const AddressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    addressLine: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }, { timestamps: true });
  
  const Address = mongoose.model("Address", AddressSchema);
  module.exports = Address;
  