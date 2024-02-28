const User = require('../../models/user');
const bcrypt = require('bcrypt');




class registerController {

    async register(req, res) {
        try {
            const {firstName, lastName,  username, gender, phoneNumber, password, role,email , dateOfBirth} = req.body;

            // Check if the phone number is already in use
            const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });

            if (existingUser) {
                // Vérifier si le numéro de téléphone ou l'e-mail est déjà utilisé par un autre utilisateur
                if (existingUser.phoneNumber === phoneNumber) {
                    return res.status(400).json({ error: 'Phone number already in use' });
                } else if (existingUser.email === email) {
                    return res.status(400).json({ error: 'Email already in use' });
                }
            }
            

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({
                firstName,
                lastName,
                username,
                gender,
                phoneNumber,
                password: hashedPassword,
                role ,// Assuming the role is passed in the request body
                email,
                dateOfBirth
            });

            // Save the user to the database
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error registering user' });
        }
    }
}
module.exports = new registerController();