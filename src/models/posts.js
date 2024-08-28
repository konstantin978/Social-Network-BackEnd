const mongoose = require('mongoose');
const { Schema } = mongoose;

const postsSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
    },
    image: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: Schema.Types.ObjectId,
    }],
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Post', postsSchema);
