const mongoose = require('mongoose');
const usersSchema = require('../models/users');

class UsersServices {

    static getUserByUsername = async (username) => {
        if (!username) {
            console.error('Invalid or missing username');
            return;
        }

        try {
            const user = await usersSchema.findOne({ username });
            if (!user) {
                console.error('User not found');
                return;
            }
            return user;
        } catch (error) {
            console.error(`Error fetching user: ${error.message}`);
        }
    };

    static getFollowersByUsername = async (username) => {
        if (!username) {
            console.error('Invalid or missing username');
            return;
        }

        try {
            const user = await usersSchema.findOne({ username });
            if (!user) {
                console.error('User not found');
                return;
            }

            return user.followers;
        } catch (error) {
            console.error(`Error fetching user: ${error.message}`);
        }
    };

    static getFollowingByUsername = async (username) => {
        if (!username) {
            console.error('Invalid or missing username');
            return;
        }

        try {
            const user = await usersSchema.findOne({ username });
            if (!user) {
                console.error('User not found');
                return;
            }

            return user.following;
        } catch (error) {
            console.error(`Error fetching user: ${error.message}`);
        }
    };

    static followByUsername = async (flwUsername, ourUser) => {
        if (!flwUsername) {
            console.error('Followed username is required');
            return;
        }

        try {
            const followedUser = await usersSchema.findOne({ username: flwUsername });
            if (!followedUser) {
                console.error('Followed User not found');
                return;
            }

            const followingUser = await usersSchema.findById(ourUser._id);
            if (!followingUser) {
                console.error('Current User not found');
                return;
            }

            if (followedUser.followers.some(follower => follower.id == followingUser._id)) {
                console.error('Already following this user');
                return;
            }

            followedUser.followers.push({
                id: followingUser._id,
                username: followingUser.username
            });

            followingUser.following.push({
                id: followedUser._id,
                username: followedUser.username
            });

            await followedUser.save();
            await followingUser.save();

            return {
                followedUser,
                followingUser
            };

        } catch (error) {
            console.error(`Error in followByUsername: ${error.message}`);
        }
    }

    static unFollowByUsername = async (flwUsername, ourUser) => {
        if (!flwUsername) {
            console.error('Followed username is required');
            return;
        }
        if (!ourUser || !ourUser._id) {
            console.error('Current user information is missing');
            return;
        }

        try {
            const unFollowedUser = await usersSchema.findOne({ username: flwUsername });
            if (!unFollowedUser) {
                console.error('Followed User not found');
                return;
            }

            const followingUser = await usersSchema.findById(ourUser._id);
            if (!followingUser) {
                console.error('Current User not found');
                return;
            }

            unFollowedUser.followers = unFollowedUser.followers.filter(follower => follower.id != followingUser._id);

            followingUser.following = followingUser.following.filter(following => following.id != unFollowedUser._id);

            await unFollowedUser.save();
            await followingUser.save();

            return unFollowedUser;

        } catch (error) {
            console.error(`Error in unFollowByUsername: ${error.message}`);
        }
    };

    static blockByUsername = async (blckUsername, ourUser) => {
        if (!blckUsername) {
            console.error('Blocked username is required');
            return;
        }
        if (!ourUser || !ourUser._id) {
            console.error('Current user information is missing');
            return;
        }

        try {
            const blockedUser = await usersSchema.findOne({ username: blckUsername });
            if (!blockedUser) {
                console.error('Blocked User not found');
                return;
            }

            const currentUser = await usersSchema.findById(ourUser._id);
            if (!currentUser) {
                console.error('Current User not found');
                return;
            }

            currentUser.blocks.push({
                id: blockedUser._id,
                username: blockedUser.username
            });

            await currentUser.save();

            return currentUser;

        } catch (error) {
            console.error(`Error in blockByUsername: ${error.message}`);
        }
    };

    static unblockByUsername = async (blckUsername, ourUser) => {
        if (!blckUsername) {
            console.error('Blocked username is required');
            return;
        }
        if (!ourUser || !ourUser._id) {
            console.error('Current user information is missing');
            return;
        }

        try {
            const blockedUser = await usersSchema.findOne({ username: blckUsername });
            if (!blockedUser) {
                console.error('Blocked User not found');
                return;
            };

            const currentUser = await usersSchema.findById(ourUser._id);
            if (!currentUser) {
                console.error('Current User not found');
                return;
            };

            currentUser.blocks = currentUser.blocks.filter(block => block.id != blockedUser._id);

            await currentUser.save();

            return currentUser;

        } catch (error) {
            console.error(`Error in unblockByUsername: ${error.message}`);
        };
    };

    static likePost = async (postId) => {
        
    };
};

module.exports = UsersServices;
