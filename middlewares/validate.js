const User = require('../../models/user');
const yup = require('yup');

const validate = async (req, res, next) => {
    try {
        const schema = yup.object().shape({
            username: yup.string().required().test('username_unique', 'Username is already taken', async function (value) {
                const isUnique = await checkUsernameUniqueness(value);
                return isUnique;
            }),
            firstName: yup.string().notRequired().min(4, 'First name must contain at least 4 characters').max(10, 'First name must contain a maximum of 10 characters'),
            lastName: yup.string().notRequired().min(4, 'Last name must contain at least 4 characters').max(10, 'Last name must contain a maximum of 10 characters'),
            age: yup.number().positive().required(),
            email: yup.string().required().email().test('email_unique', 'Email is already taken', async function (value) {
                const isUnique = await checkEmailUniqueness(value);
                return isUnique;
            }),          
            password: yup.string().required().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one letter and one number'),
            registrationDate: yup.date().default(() => new Date()),
            lastLogin: yup.date().notRequired(),
            dateOfBirth: yup.date().notRequired().max(new Date(Date.now() - (18 * 365 * 24 * 60 * 60 * 1000)), 'You must be at least 18 years old'),
            phoneNumber: yup.string().notRequired().matches(/^\d{8}$/, 'Phone number must be 8 digits long'),
            gender: yup.string().oneOf(['Male', 'Female']),
            address: yup.string().notRequired().min(5).max(15),
            image: yup.string().notRequired(),
            createdAt: yup.date().notRequired().default(() => new Date()),
            updatedAt: yup.date().notRequired(),
            role: yup.string().required().oneOf(["admin", "teacher", "student"]),
            status: yup.string().required().oneOf(["active", "inactive", "deleted", "suspended", "offboarded", "archived"]),
            isDeleted: yup.boolean().notRequired().default(false)
        });

        async function checkUsernameUniqueness(username) {
            const existingUser = await userModel.findOne({ username: username });
            return !existingUser;
        }

        async function checkEmailUniqueness(email) {
            const existingUser = await userModel.findOne({ email: email });
            return !existingUser;
        }

        // Perform validation
        await schema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { validate };