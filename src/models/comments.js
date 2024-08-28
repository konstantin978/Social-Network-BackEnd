const { Schema, default: mongoose } = require('mongoose');

const commentsSchema = Schema({
    
});

const Comment = mongoose.model('comments', commentsSchema);
module.exports = Comment;
