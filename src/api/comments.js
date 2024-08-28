const { Router } = require('express');
const User = require('../models/users');
const Post = require('../models/posts');
const commentsRouter = Router();

module.exports = commentsRouter;