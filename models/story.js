const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        required: true,
        default: true
    },
    story: {
        type: String,
        required: true        
    },
    date: {
        type: Date
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comments: [{
        commentBody: {
            type: String
        },
        userCommentId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        commentDate: {
            type: Date,
        }
    }]
});

module.exports = mongoose.model('Storie', storySchema);