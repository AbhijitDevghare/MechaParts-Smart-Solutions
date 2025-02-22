const AppError = require("../../utils/error.utils.js");
const {userRepository} = require("../../repositories/index");
const bcrypt = require("bcrypt")

class AdminService
{
    async loginAdmin(identifier,password){
        if (!identifier || !password) {
            throw new AppError("Identifier (username, email, or phone number) and password are required", 400);
          }
    
      
          let user = await userRepository.findByEmail(identifier) || 
                       await userRepository.findByUsername(identifier) ||
                       await userRepository.findByPhoneNumber(identifier);
          
      
          if (!user) {
            throw new AppError("User doesn't exist", 404);
          }

          const isAdmin = await userRepository.findAdmin(user._id)
          
          if(!isAdmin)
          {
            throw new AppError("Not Authorized user")
          }
          
           Object.assign(user, { role: adminUser.role });

        
          const checkPassword = await bcrypt.compare(password, user.password);
        
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
}

module.exports = new AdminService();