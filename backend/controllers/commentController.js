const CommentModel = require('../models/CommentModel');
const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');
const FriendshipModel = require('../models/friendShipModel');

/*const getCommentById = (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "Comment ID is required." });
    }

    CommentModel.getCommentById(id, (err, comment) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the comment." });
        }

        if (comment.length === 0) {
            return res.status(404).json({ error: "Comment not found." });
        }

        return res.status(200).json(comment[0]);
    });
};*/

const getCommentById = (req, res) => {
    const id = req.params.id;
    const idLoggedInUser = req.user.id;

    if (!id) {
        return res.status(400).json({ error: "Comment ID is required." });
    }

    CommentModel.getCommentById(id, (err, comment) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the comment." });
        }

        if (comment.length === 0) {
            return res.status(404).json({ error: "Comment not found." });
        }

        const targetComment = comment[0];

        if (targetComment.idUser === idLoggedInUser) {
            return res.status(200).json(targetComment);
        }

        PostModel.getPostById(targetComment.idPost, (err, postArray) => {
            if (err) return res.status(500).json({ error: "Error verifying the post." });

            if (postArray.length === 0) return res.status(404).json({ error: "Post not found." });

            const targetPost = postArray[0];

            UserModel.getUserById(targetPost.idUser, (err, user) => {
                if (err) return res.status(500).json({ error: "Error checking user profile." });

                const authorProfile = user[0];

                if (authorProfile.privacy === 'pr' || targetPost.visibility === 'pr') {
                    FriendshipModel.checkIfFriends(idLoggedInUser, targetPost.idUser, (err, areFriends) => {
                        if (err) return res.status(500).json({ error: "Error checking permissions." });
                        if (!areFriends) return res.status(403).json({ error: "This comment belongs to a private post. Access denied." });

                        return res.status(200).json(targetComment);
                    });
                } else {
                    return res.status(200).json(targetComment);
                }
            });
        });
    });
};

/*const getCommentsByPost = (req, res) => {
    const { idPost } = req.params;
    //if (idPost === undefined) return res.status(400).send();

    if (!idPost) {
        return res.status(400).json({ error: "Post ID is required." });
    }

    CommentModel.getCommentsByPost(idPost, (err, comments) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for comments." });
        }

        return res.status(200).json(comments);
    });
};*/

const getCommentsByPost = (req, res) => {
    const { idPost } = req.params;
    const idLoggedInUser = req.user.id;

    if (!idPost) {
        return res.status(400).json({ error: "Post ID is required." });
    }

    const getCommentsFunc = () => {
        CommentModel.getCommentsByPost(idPost, (err, comments) => {
            if (err) {
                return res.status(500).json({ error: "Error searching for comments." });
            }
            return res.status(200).json(comments);
        });
    };

    PostModel.getPostById(idPost, (err, postArray) => {
        if (err) return res.status(500).json({ error: "Error verifying the post." });
        if (postArray.length === 0) return res.status(404).json({ error: "Post not found." });

        const targetPost = postArray[0];

        if (targetPost.visibility === 'pu' || targetPost.idUser === idLoggedInUser) {
            getCommentsFunc();
        } else {
            FriendshipModel.checkIfFriends(idLoggedInUser, targetPost.idUser, (err, areFriends) => {
                if (err) return res.status(500).json({ error: "Error checking permissions." });

                if (!areFriends) {
                    return res.status(403).json({ error: "This post is private. You cannot view its comments." });
                }

                getCommentsFunc();
            });
        }
    });
};

/*const createComment = (req, res) => {


    const idUser = req.user.id;
    const { idPost, commentText, parentCommentId} = req.body;

    if (!idPost || !commentText) {
        return res.status(400).json({ error: "The post ID and comment text are required." });
    }

    const commentData = {
        idPost: idPost,
        idUser: idUser,
        commentText: commentText,
        parentCommentId: parentCommentId || null
    };

    CommentModel.createComment(commentData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating comment. Check if the post exists." });
        }
        return res.status(201).json({ message: "Comment created successfully." });
    });
};*/

const createComment = (req, res) => {
    const idUser = req.user.id;
    const { idPost, commentText, parentCommentId} = req.body;

    if (!idPost || !commentText) {
        return res.status(400).json({ error: "The post ID and comment text are required." });
    }

    const commentData = {
        idPost: idPost,
        idUser: idUser,
        commentText: commentText,
        parentCommentId: parentCommentId || null
    };

    const createCommentFunc = () => {
        CommentModel.createComment(commentData, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error creating comment. Check if the post exists." });
            }
            return res.status(201).json({ message: "Comment created successfully." });
        });
    };

    PostModel.getPostById(idPost, (err, post) => {
        if (err) return res.status(500).json({ error: "Error verifying the post." });
        if (post.length === 0) return res.status(404).json({ error: "Post not found." });

        const targetPost = post[0];

        if (targetPost.idUser === idUser) {
            return createCommentFunc();
        }

        UserModel.getUserById(targetPost.idUser, (err, user) => {
            if (err) return res.status(500).json({ error: "Error checking user profile." });

            const authorProfile = user[0];

            if (authorProfile.privacy === 'pr' || targetPost.visibility === 'pr') {

                FriendshipModel.checkIfFriends(idUser, targetPost.idUser, (err, areFriends) => {
                    if (err) return res.status(500).json({ error: "Error checking permissions." });

                    if (!areFriends) {
                        return res.status(403).json({ error: "Access denied. Private account or post." });
                    }

                    return createCommentFunc();
                });
            } else {
                return createCommentFunc();
            }
        });
    });
};

const updateComment = (req, res) => {
    /*const id = req.params.id;

    if (id === undefined) return res.status(400).send();
    if (!req.body.commentText) return res.status(400).send();*/

    const idComment = req.params.id;
    const { commentText } = req.body;
    const loggedInUserId = req.user.id;

    if (!idComment || !commentText) {
        return res.status(400).json({ error: "The comment ID and the new text are required." });
    }

    CommentModel.getCommentById(idComment, (err, comment) => {
        if (err) {
            return res.status(500).json({ error: "Error verifying comment." });
        }

        if (comment.length === 0) {
            return res.status(404).json({ error: "Comment not found." });
        }

        if (comment[0].idUser !== loggedInUserId) {
            return res.status(403).json({ error: "You do not have permission to update this comment." });
        }

        CommentModel.updateComment(idComment, commentText, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error updating the comment." });
            }
            return res.status(200).json({ message: "Comment updated successfully." });
        });
    });
};

const deleteComment = (req, res) => {
    /*const id = req.params.id;
    if (id === undefined) return res.status(400).send();*/

    const idComment = req.params.id;
    const loggedInUserId = req.user.id;

    if (!idComment) {
        return res.status(400).json({ error: "The comment ID is required." });
    }

    CommentModel.getCommentById(idComment, (err, comment) => {
        if (err) {
            return res.status(500).json({error: "Error verifying comment."});
        }

        if (comment.length === 0) {
            return res.status(404).json({error: "Comment not found."});
        }

        if (comment[0].idUser !== loggedInUserId) {
            return res.status(403).json({error: "You do not have permission to delete this comment."});
        }

        CommentModel.deleteComment(idComment, (err, result) => {
            if (err) {
                return res.status(500).json({error: "Error deleting the comment."});
            }
            return res.status(200).json({message: "Comment deleted successfully."});
        });
    });
};

module.exports = {
    getCommentById,
    getCommentsByPost,
    createComment,
    updateComment,
    deleteComment
};