const { Router } = require('express');
const User = require('../models/users');
const authJWT = require('../jwt/auth');
const Photo = require('../models/photo');
const FeedServices = require('../services/feed');

const feedRouter = Router();

feedRouter.get('/', authJWT, async (req, res) => {
    const result = await FeedServices.getLastPosts(req.user._id);
    res.send(result);
});

module.exports = feedRouter;