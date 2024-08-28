const { Schema, default: mongoose } = require('mongoose');

const commentsSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Comment = mongoose.model('comments', commentsSchema);
module.exports = Comment;
