const CommentModel = require('../models/CommentModel');
const {verifyPostAccess} = require("../utils/securityHelper");

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

        verifyPostAccess(targetComment.idPost, idLoggedInUser, res, (targetPost) => {
            return res.status(200).json(targetComment);
        });
    });
};

const getCommentsByPost = (req, res) => {
    const { idPost } = req.params;
    const idLoggedInUser = req.user.id;

    if (!idPost) {
        return res.status(400).json({ error: "Post ID is required." });
    }

    verifyPostAccess(idPost, idLoggedInUser, res, (targetPost) => {
        CommentModel.getCommentsByPost(idPost, (err, comments) => {
            if (err) return res.status(500).json({ error: "Error searching for comments." });
            return res.status(200).json(comments);
        });
    });
};

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

    verifyPostAccess(idPost, idUser, res, (targetPost) => {
        CommentModel.createComment(commentData, (err, result) => {
            if (err) return res.status(500).json({ error: "Error creating comment." });
            return res.status(201).json({ message: "Comment created successfully." });
        });
    });
};

const updateComment = (req, res) => {

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