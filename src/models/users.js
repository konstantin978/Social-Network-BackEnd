const { Schema, default: mongoose } = require('mongoose');

const usersSchema = new Schema({
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [],
    following: [],
    blocks: [],
    likes: [],
    posts: [],
    bio: {
        type: String,
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    },
});

module.exports = mongoose.model('users', usersSchema);