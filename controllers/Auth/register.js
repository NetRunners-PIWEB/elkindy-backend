const User = require('../../models/user');
const Teacher = require('../../models/teacher'); // Assuming you've created a separate Teacher model
const jwt = require('jsonwebtoken');
const { createSecretToken } = require('../../middlewares/SecretToken');
class RegisterController {
    async register(req, res) {
        try {
            const { username, firstName, lastName, age, email, password, phoneNumber, gender, address, dateOfBirth, role } = req.body;

            // Check if the user already exists
            let existingUser = await User.findOne({ $or: [{ email }, { username }, { phoneNumber }] });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists." });
            }

            // Create a new user
            const newUser = new User({
                username,
                firstName,
                lastName,
                age,
                email,
                password,
                phoneNumber,
                gender,
                address,
                dateOfBirth,
                role,
            });

            await newUser.save();
            if (newUser.role === 'teacher') {
                const { degree, specialization, teachingExperience, coursesTaught } = req.body;
            
                const newTeacher = new Teacher({
                  userId: newUser._id,
                  professionalDetails: {
                    degree,
                    specialization,
                    teachingExperience,
                    coursesTaught,
                  },
                });
            
                await newTeacher.save();
              }
            
              const token = createSecretToken(newUser._id);
                 res.cookie("token", token, {
                  withCredentials: true,
                 httpOnly: false,
                  });

              res.status(201).json({ message: "User registered successfully!", userId: newUser._id, token }); 
              
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: "Error registering new user", error: error.message });
        }
       
    }
}

module.exports = new RegisterController();
