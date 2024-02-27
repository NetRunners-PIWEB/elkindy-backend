const express = require('express');
const router = express.Router();
const { listTeachers } = require('../../controllers/userController/userController');

router.get('/teachers', listTeachers);

module.exports = router;