const dotenv = require('dotenv').config();
const { Router } = require('express');
const postsRouter = Router();
const authJWT = require('../jwt/auth');
const PostsService = require('../services/posts');

postsRouter.get('/', authJWT, async (req, res) => {
    try {
        const result = await PostsService.getAllPosts();

        if (!result || result.length === 0) {
            return res.status(404).send({ message: 'No posts found' });
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

postsRouter.get('/:title', authJWT, async (req, res) => {
    try {
        const { title } = req.params;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).send({ message: 'Invalid or missing title' });
        }

        const result = await PostsService.getPostByTitle(title);

        if (!result) {
            return res.status(404).send({ message: 'Post not found' });
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    };
});

postsRouter.post('/addpost', authJWT, async (req, res) => {
    try {
        const { title, content, image } = req.body;
        if (!title || !content) {
            res.status(409).send('Invalid credantionals');
        }
        const result = PostsService.addPost(title, content, image, req.user);

        res.status(200).send('Post added successfully');
    } catch (error) {
        res.status(500).send(error);
    };
});

postsRouter.delete('/deletepost/:postId', authJWT, async (req, res) => {
    try {
        const { postId } = req.params;
        const result = await PostsService.deletePost(postId, req.user);

        if (!result) {
            return res.status(400).send('Post could not be deleted');
        }

        res.status(200).send('Post deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = postsRouter;

