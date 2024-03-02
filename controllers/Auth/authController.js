const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../../middlewares/asyncHandler');

class AuthController {

     login = asyncHandler(async (req, res) => {
      const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username, role: user.role },  'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
         
      
    });


    async logout(req, res) {
        try {
        //     // Clear the JWT token from the client-side 
        //     // Assuming you stored the token as 'jwtToken' remove it from localStorage
             localStorage.removeItem('jwtToken'); 
        //     // Redirect the user to the login page
           res.redirect('/login'); 
         } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error logging out' });
         }
    }
  
    async loginGoogle(req, res) {
   
    }
  
  }
  
  module.exports = new AuthController();
  