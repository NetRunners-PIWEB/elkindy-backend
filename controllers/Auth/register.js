const User = require('../../models/user');
const Teacher = require('../../models/teacher'); // Assuming you've created a separate Teacher model
const jwt = require('jsonwebtoken');
const { createSecretToken } = require('../../middlewares/SecretToken');
const generateToken = require('../../config/generateToken');
class RegisterController {
    async registerEnroll(req, res) {
        try {
            const { username, firstName, lastName, age, email, password, phoneNumber, gender, address, dateOfBirth, role, preferedInstrument, courses } = req.body;

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
                preferedInstrument,
                courses: []
            });

            if (role === 'user' && Array.isArray(courses) && courses.length) {
                newUser.courses = courses.map(courseId => ({ courseId, status: 'pending' }));
            }

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
        /*   const   emailsearch = newUser.email ;
            
              const findUser = await User.findOne({ emailsearch });

                
              const { firstNamefound, lastNamefound, emailfound, _id, mobile } = findUser;*/
             const user=newUser;

              res.status(201).json({user,
                 token: generateToken(user._id)}); 
              
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: "Error registering new user", error: error.message });
        }
       
    }
    async register(req, res) {
        try {
            const { username, firstName, lastName, age, email, password, phoneNumber, gender, address, dateOfBirth, role, preferedInstrument } = req.body;

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
                preferedInstrument
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

             res.status(201).json({
                 user: newUser,
                 token: generateToken(newUser._id)
             }); 
              
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: "Error registering new user", error: error.message });
        }
       
    }
}


module.exports = new RegisterController();
