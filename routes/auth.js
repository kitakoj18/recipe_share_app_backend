const express = require('express');
const router = express.Router();

const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Not a valid email. Please enter again.')
        .normalizeEmail(),
        body('password').trim().isLength({min: 5}),
        body('name').trim().not().isEmpty()
],
    authController.signup)

module.exports = router;