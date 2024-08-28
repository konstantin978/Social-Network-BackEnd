const { Schema, default: mongoose } = require('mongoose');

const feedSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Feed = mongoose.model('feed', feedSchema);

module.exports = Feed;