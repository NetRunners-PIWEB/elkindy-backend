const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find the user by username
            const user = await User.findOne({ username });

            // If user doesn't exist or password is incorrect, send an error response
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ username: user.username, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error logging in' });
        }
    }

  
    async logout(req, res) {
        // try {
        //     // Clear the JWT token from the client-side 
        //     // Assuming you stored the token as 'jwtToken' remove it from localStorage
        //     localStorage.removeItem('jwtToken'); 
        //     // Redirect the user to the login page
        //     res.redirect('/login'); 
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ error: 'Error logging out' });
        // }
    }
  
    async loginGoogle(req, res) {
   
    }
  
  }
  
  module.exports = new AuthController();
  