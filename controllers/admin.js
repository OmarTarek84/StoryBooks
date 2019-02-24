const Story = require('../models/story');
const User = require('../models/user');

exports.getAddStory = (req, res, next) => {
    res.render('addstory', {
        title: 'Add Story',
        editing: false
    });    
};

exports.postAddStory = (req, res, next) => {
    const title = req.body.title;
    const status = req.body.status;
    const storyPost = req.body.story;
    let allowComments;

    if(req.body.allowcomments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    const story = new Story({
        title: title,
        status: status,
        allowComments: allowComments,
        story: storyPost,
        date: Date.now(),
        comments: [],
        userId: req.user._id
    });
    return story.save().then(result => {
        User.findById(req.user._id).then(user => {
            if(!user) {
                return res.status(500).render('addstory', {
                    title: 'Add Story',
                    errorMessage: 'Database operation failed, please Try Again!'
                });
            }
            user.stories.push(story);
            return user.save();
        })
        .then(() => {res.redirect('/mystories')})
        .catch(err => {
            const error = new Error(err);
            next(err);
        });
    });
};

exports.getStory = (req, res, next) => {
    const storyId = req.params.storyId;
    Story.findById(storyId).populate('userId').populate('comments.userCommentId').then(story => {
        res.render('story', {
            title: 'Story',
            story: story,
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};

exports.getMyStories = (req, res, next) => {
    Story.find({userId: req.user._id}).populate('userId').then(stories => {
        res.render('mystories', {
            title: 'My Stories',
            stories: stories
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};

exports.getEditStory = (req, res, next) => {
    const storyId = req.params.storyId;
    const edit = req.query.edit;
    Story.findById(storyId).then(story => {
        res.render('addstory', {
            title: 'Edit Story',
            editing: edit,
            story: story
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};

exports.postEditStory = (req, res, next) => {
    const title = req.body.title;
    const status = req.body.status;
    const storyPost = req.body.story;
    const storyId = req.body.storyId;
    let allowComments;

    if(req.body.allowcomments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    Story.findById(storyId).then(story => {
        if(!story) {
            return res.status(500).render('addstory', {
                title: 'Edit Story',
                errorMessage: 'Database operation failed, please Try Again!'
            });
        }
        story.title = title;
        story.status = status;
        story.story = storyPost;
        story.allowComments = allowComments;
        return story.save().then(result => {
            res.redirect('mystories');
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};

exports.postDeleteStory = (req, res, next) => {
    const storyId = req.body.storyId;
    Story.findByIdAndDelete(storyId).then(result => {
        User.findById(req.user._id).then(user => {
            user.stories.pull(result);
            return user.save();
        }).then(resu => {
            res.redirect('/mystories');
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};

exports.postAddComment = (req, res, next) => {
    const storyId = req.body.storyId;
    const comment = req.body.comment;

    Story.findById(storyId).then(story => {
        const newComment = {
            commentBody: comment,
            userCommentId: req.user._id,
            commentDate: Date.now()
        };

        story.comments.unshift(newComment);
        story.save().then(result => {
            return res.redirect('/publicstories/' + storyId);
        });
    })
    .catch(err => {
        const error = new Error(err);
        next(err);
    });
};