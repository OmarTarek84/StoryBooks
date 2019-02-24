const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {validationResult} = require('express-validator/check');

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const confirmPassword = req.body.confirmpassword;
    let imageUrl;
    const errors = validationResult(req);

    if(!req.file) {
        imageUrl = null;
    } else {
        imageUrl = req.file.path;
    }

    if(!errors.isEmpty()) {
        return res.status(422).render('signup', {
            title: 'Sign Up',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                firstname: firstname,
                lastname: lastname,
            }
        });
    }

    bcrypt.hash(password, 12).then(hashedpass => {
        const user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedpass,
            imageUrl: imageUrl,
            stories: []
        });
        return user.save().then(result => {
            return res.redirect('/login');
        });
    })
    .catch(err => {
        const error = new Error(err);
        return next(error);
    });
};

exports.logIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('login', {
            title: 'Log In',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            }
        });
    }

    User.findOne({email: email}).then(user => {
        if(!user) {
            return res.status(500).render('login', {
                title: 'Log In',
                isAuthenticated: false,
                errorMessage: 'Invalid Email Or Password',
                oldInput: {
                    email: email,
                    password: password
                }
            });
        }
        bcrypt.compare(password, user.password).then(doMatch => {
            if(!doMatch) {
                return res.status(500).render('login', {
                    title: 'Log In',
                    isAuthenticated: false,
                    errorMessage: 'Invalid Email Or Password',
                    oldInput: {
                        email: email,
                        password: password
                    }
                });
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                res.redirect('/mystories');
            });
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
};