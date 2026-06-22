const PostModel = require('../models/postModel');
const {checkIfFriends} = require("../models/friendShipModel");
const {getUserById} = require("../models/userModel");
const {verifyPostAccess} = require("../utils/securityHelper");

const getPostById = (req, res) => {
    const id = req.params.id;
    const idLoggedInUser = req.user.id;

    if (!id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    verifyPostAccess(id, idLoggedInUser, res, (targetPost) => {
        return res.status(200).json(targetPost);
    });
};

const getPostsByUser = (req, res) => {
    const idTargetUser = req.params.id;
    const idLoggedInUser = req.user.id;

    if (!idTargetUser) {
        return res.status(400).json({ error: "User ID is required." });
    }

    getUserById(idTargetUser, (err, userArray) => {
        if (err) return res.status(500).json({ error: "Error checking user profile." });
        if (userArray.length === 0) return res.status(404).json({ error: "User not found." });

        const targetUser = userArray[0];
        const isSameUser = parseInt(idTargetUser) === idLoggedInUser;

        checkIfFriends(idLoggedInUser, idTargetUser, (err, areFriends) => {
            if (err) return res.status(500).json({ error: "Error checking friendship." });

            PostModel.getPostsByUser(idTargetUser, (err, posts) => {
                if (err) {
                    return res.status(500).json({ error: "Database error." });
                }

                if (posts.length === 0) {
                    return res.status(200).json([]);
                }

                if (areFriends || isSameUser) {
                    return res.status(200).json(posts);
                } else {
                    const publicPosts = posts.filter(post => post.visibility === 'pu');

                    if (targetUser.privacy === 'pr' && publicPosts.length === 0) {
                        return res.status(403).json({ error: "This account is private. Only friends can see posts." });
                    }

                    return res.status(200).json(publicPosts);
                }
            });
        });
    });
};

const getPosts = (req, res) => {
    PostModel.getPosts((err, posts) => {
        if(err){
            return res.status(500).json({ error: "Database error." });
        }

        return res.status(200).json(posts);
    });
};

const getPostsFeed = (req, res) => {
    const idLoggedInUser = req.user.id;

    PostModel.getFeed(idLoggedInUser, (err, posts) => {
        if(err){
            return res.status(500).json({ error: "Database error fetching the feed." });
        }

        return res.status(200).json(posts);
    });
}

const createPost = (req, res) => {
    const idUser = req.user.id;
    const { postText, visibility } = req.body;

    if (!postText) {
        return res.status(400).json({ error: "The text of the post is required." });
    }

    let vis = visibility;

    if (vis===undefined || vis===null){
         vis='pu';
    }
    else if (vis !== 'pu' && vis !== 'pr') {
        return res.status(400).json({ error: "Visibility must be 'pu' or 'pr'." });
    }

    const postData = { idUser, postText, vis };

    PostModel.createPost(postData, (err, post) => {
        if (err) {
            return res.status(500).json({ error: "Error creating post in database." });
        }
        return res.status(201).json({ message: "Post created successfully." });
    });
};

const updatePost = (req, res) => {
    const id = req.params.id;
    const loggedInUserId = req.user.id;
    const {postText, visibility} = req.body;

    if (!postText) {
        return res.status(400).json({ error: "The text of the post is required." });
    }

    let vis = visibility;

    if (vis !== undefined && vis !== null) {
        if (vis !== 'pu' && vis !== 'pr') {
            return res.status(400).json({ error: "Visibility must be 'pu' or 'pr'." });
        }
    }

    PostModel.getPostById(id, (err, post) => {
        if (err) {
            return res.status(500).json({ error: "Error verifying the post." });
        }
        if (post.length === 0) {
            return res.status(404).json({ error: "Post not found." });
        }

        if (post[0].idUser !== loggedInUserId) {
            return res.status(403).json({ error: "You do not have permission to update this post." });
        }

        if (vis === undefined || vis === null) {
            vis = post[0].visibility;
        }

        PostModel.updatePost(id, postText, vis, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error updating post in database." });
            }
            return res.status(200).json({ message: "Post updated successfully." });
        });
    });
};

const deletePost = (req, res) => {
    const id = req.params.id;
    const loggedInUserId = req.user.id;

    if (id === undefined) {
        return res.status(400).json({ error: "User ID is required." })
    }
    PostModel.getPostById(id, (err, post) => {
        if (err) {
            return res.status(500).json({ error: "Error verifying the post." });
        }
        if (post.length === 0) {
            return res.status(404).json({ error: "Post not found." });
        }

        if (post[0].idUser !== loggedInUserId) {
            return res.status(403).json({ error: "You do not have permission to delete this post." });
        }

        PostModel.deletePost(id, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error deleting post in database." });
            }
            return res.status(200).json({ message: `Post ${id} deleted successfully.` });
        });
    });
};

module.exports = {
    getPostById,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostsByUser,
    getPostsFeed
};