const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/classController");


router.post('/createClass', controllers.createClass);
router.get('/classes', controllers.getAllClasses);
router.get('/class/:id', controllers.getClassById);
router.put('/updateClass/:id', controllers.updateClass);
router.delete('/deleteClass/:id', controllers.deleteClass);

module.exports = router;