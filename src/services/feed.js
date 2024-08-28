const usersSchema = require('../models/users');
const Post = require('../models/posts');
const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.connect();

class FeedServices {
    static getLastPosts = async (userId) => {
        try {

            const cacheKey = `feed:${userId}`;
            const cachedPosts = await redisClient.get(cacheKey);

            if (cachedPosts) {
                return JSON.parse(cachedPosts);
            }

            const user = await usersSchema.findOne({ _id: userId });
            if (!user) {
                throw new Error('User not found');
            }

            const followingIds = user.following.map(follow => follow.id);

            const posts = await Post.find({ author: { $in: followingIds } })
                .sort({ created: -1 })
                .limit(5);

            await redisClient.set(cacheKey, JSON.stringify(posts));

            return posts;
        } catch (error) {
            console.error('Error with posts:', error);
        };
    };
};

module.exports = FeedServices;