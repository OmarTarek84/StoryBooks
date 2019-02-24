const Story = require('../models/story');
const User = require('../models/user');

exports.getHomePage = (req, res, next) => {
    res.render('index', {
        title: 'HomePage'
    });
};

exports.getSignup = (req, res, next) => {
    res.render('signup', {
        title: 'Sign Up',
        isAuthenticated: false,
        errorMessage: null,
        oldInput: {
            email: '',
            firstname: '',
            lastname: '',
        }
    });
};

exports.getLogin = (req, res, next) => {
    res.render('login', {
        title: 'Log In',
        isAuthenticated: false,
        errorMessage: null,
        oldInput: {
            email: '',
            password: ''
        }
    });    
};

exports.getPublicStories = (req, res, next) => {
    Story.find({status: "public"}).sort({date: 'desc'}).populate('userId').then(stories => {
        if(req.session.user) {
            res.render('stories', {
                title: 'Stories',
                stories: stories,
                idUser: req.user._id.toString(),
                user: false
            });
        } else {
            res.render('stories', {
                title: 'Stories',
                stories: stories,
                idUser: null,
                user: false
            }); 
        }
    });  
};

exports.getUserstories = (req, res, next) => {
    const UserID = req.params.userID;
    Story.find({userId: UserID, status: 'public'}).populate('userId').then(stories => {
        res.render('stories', {
            title: 'User Stories',
            stories: stories,
            user: true
        });
    });
};