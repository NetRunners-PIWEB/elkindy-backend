const supertest = require('supertest');
const app = require('../app.js');
const request = supertest(app);
const User = require('../models/user.js');

describe('User Controller', () => {
    describe('POST /api/user/createUser creates a new user', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                // User data
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                // Add other properties as needed
            };

            const response = await request.post('/api/user/createUser').send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
            expect(response.body.firstName).toBe(userData.firstName);
            expect(response.body.lastName).toBe(userData.lastName);
            expect(response.body.email).toBe(userData.email);

            // Check if the user is saved in the database
            const createdUser = await User.findOne({ email: userData.email });
            expect(createdUser).toBeTruthy();
            expect(createdUser.firstName).toBe(userData.firstName);
            expect(createdUser.lastName).toBe(userData.lastName);
            expect(createdUser.email).toBe(userData.email);
        });
    });

    // Write similar tests for other user controller methods like getAllUsers, getUserById, updateUser, deleteUser, listTeachers, getAllStudents
});
