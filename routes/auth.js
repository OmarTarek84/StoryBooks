const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

router.post('/signup', [
    check('email')
    .isEmail().withMessage('Email is not valid')
    .custom((value, {req}) => {
        return User.findOne({email: value}).then(user => {
            if(user) {
                return Promise.reject('Email Already Exists');
            }
            return true;
        });
    }),
    body('password')
    .isLength({min: 6}).withMessage('password must be at least 6 characters'),
    body('confirmpassword')
    .custom((value, {req}) => {
        if(value != req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], 
authController.postSignup);

router.post('/login', [
    check('email', 'Invalid Email Or Password')
    .isEmail()
], 
authController.logIn);

router.post('/logout', authController.postLogout);

module.exports = router;