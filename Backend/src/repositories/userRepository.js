const User = require("../models/userSchema");

class UserRepository {
  
  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findByUsername(username) {
    return await User.findOne({ username }).select('+password');
  }

  async findByPhoneNumber(phoneNumber) {
    return await User.findOne({ phoneNumber }).select('+password');
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(user) {
    return await user.save();
  }

  async deleteUserById(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();
