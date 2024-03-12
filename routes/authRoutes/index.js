const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/Auth/google');

router.get('/connection', AuthController.loginGoogle);

// if page not found then status = 404 and message ... page not found
router.all('*', (req, res) => {
    res.status(404).send('Page not found!')
})


module.exports = router;