const dotenv = require('dotenv').config();
const { Router } = require('express');
const UsersServices = require('../services/users');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authJWT = require('../jwt/auth');
const Photo = require('../models/photo');
const multer = require('multer');

const usersRouter = Router();
const SECRET_KEY = dotenv.parsed.SECRET_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register
usersRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, avatar });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(`Error registering user ${error}`);
    }
});

// Login
usersRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).send({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

// Add Avatar
usersRouter.post('/upload', upload.single('photo'), authJWT, async (req, res) => {
    try {
        const photo = new Photo({
            data: req.file.buffer,
            contentType: req.file.mimetype
        });

        const savedPhoto = await photo.save();

        const user = await User.findOne({ _id: req.user });
        user.avatar = savedPhoto._id;
        await user.save();

        res.status(201).send({ photo_id: savedPhoto._id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Functionality
usersRouter.get('/:username', authJWT, async (req, res) => {
    try {
        const { username } = req.params;
        const user = await UsersServices.getUserByUsername(username);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

usersRouter.get('/followers/:username', authJWT, async (req, res) => {
    try {
        const { username } = req.params;
        const followers = await UsersServices.getFollowersByUsername(username);

        if (!followers) {
            return res.status(404).send({ message: 'Followers not found' });
        }

        res.status(200).send(followers);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

usersRouter.get('/following/:username', authJWT, async (req, res) => {
    try {
        const { username } = req.params;
        const following = await UsersServices.getFollowingByUsername(username);

        if (!following) {
            return res.status(404).send({ message: 'Following not found' });
        }

        res.status(200).send(following);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

usersRouter.post('/follow', authJWT, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send({ message: 'Username to follow is required' });
        }

        const followRes = await UsersServices.followByUsername(username, req.user);
        res.status(200).send(followRes);
    } catch (error) {
        res.status(500).send({ message: `Failed to follow user: ${error.message}` });
    }
});

usersRouter.post('/unfollow', authJWT, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send({ message: 'Username to unfollow is required' });
        };
        const followRes = await UsersServices.unFollowByUsername(username, req.user);
        res.status(200).send(followRes);
    } catch (error) {
        res.status(500).send({ message: `Failed to unfollow user: ${error.message}` });
    };
});

usersRouter.post('/block', authJWT, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send({ message: 'Username to block is required' });
        }

        const blockRes = await UsersServices.blockByUsername(username, req.user);
        res.status(200).send(blockRes);

    } catch (error) {
        res.status(500).send({ message: `Failed to block user: ${error.message}` });
    }
});

usersRouter.post('/unblock', authJWT, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send({ message: 'Username to unblock is required' });
        }

        const unblockRes = await UsersServices.unblockByUsername(username, req.user);
        res.status(200).send(unblockRes);
    } catch (error) {
        res.status(500).send({ message: `Failed to unblock user: ${error.message}` });
    }
});


module.exports = usersRouter;