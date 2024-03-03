const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/userControllers");

// Routes for User CRUD operations
router.post('/createUser',controllers.createUser);
router.get('/users', controllers.getAllUsers);
router.get('/users/:id', controllers.getUserById);
router.put('/updateUser/:id', controllers.updateUser);
router.delete('/deleteUser/:id', controllers.deleteUser);

module.exports = router;