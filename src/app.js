const express = require('express');
const dotenv = require('dotenv').config();
const usersRouter = require('./api/users');
const mongoose = require('mongoose');
const postsRouter = require('./api/posts');
const feedRouter = require('./api/feed');
const bodyParser = require('body-parser');
const Photo = require('./models/photo');

const app = express();
app.use(bodyParser.json());
const PORT = dotenv.parsed.PORT;

mongoose.connect('mongodb://localhost:27017/social');

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/feed', feedRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});

