const postsSchema = require('../models/posts');
const usersSchema = require('../models/users');

class PostsService {
    static getAllPosts = async () => {
        const response = await postsSchema.find({});
        console.log(response);

        return response;
    };

    static getPostByTitle = async (title) => {
        if (!title) {
            console.error('Invalid or missing title');
            return;
        }

        try {
            const post = await postsSchema.findOne({ title });
            if (!post) {
                console.error('Post not found');
                return;
            }
            return post;
        } catch (error) {
            console.error(`Error fetching post: ${error.message}`);
        }
    };

    static addPost = async (title, content, image = '', author) => {
        if (!title || !content) {
            console.error('Title and content are required');
            return;
        }

        try {
            const existingPost = await postsSchema.findOne({ title });

            if (existingPost) {
                console.error('A post with this title already exists');
                return;
            }

            const newPost = new postsSchema({
                title,
                content,
                image,
                author,
                likes: 0,
                comments: [],
                created: new Date(),
            });
            const savedPost = await newPost.save();

            const authorUser = await usersSchema.findById(author);
            if (!authorUser) {
                console.error('Author not found');
                return;
            }

            authorUser.posts.push(savedPost._id);
            await authorUser.save();
            await newPost.save();

            return savedPost;
        } catch (error) {
            console.error(`Error adding new post: ${error.message}`);
        }
    };

    static deletePost = async (postId, author) => {
        if (!postId || !author) {
            console.error('Post ID and author ID are required');
            return;
        }
    
        try {
            const postToDelete = await postsSchema.findById(postId);
            if (!postToDelete) {
                console.error('Post not found');
                return;
            }
    
            if (postToDelete.author != author._id) {
                console.error('Author not authorized to delete this post');
                return;
            }
    
            const authorUser = await usersSchema.findById(author);
            if (!authorUser) {
                console.error('Author not found');
                return;
            }
    
            authorUser.posts = authorUser.posts.filter(post => post != postId);
            await authorUser.save();
    
            await postToDelete.deleteOne();
    
            return postToDelete;
        } catch (error) {
            console.error(`Error deleting post: ${error.message}`);
        }
    };
    
};

module.exports = PostsService;