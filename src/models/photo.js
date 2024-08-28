const { Schema, default: mongoose } = require('mongoose');

const photoSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

module.exports = mongoose.model('Photo', photoSchema);