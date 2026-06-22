const PostLikeModel = require('../models/PostLikeModel');
const {verifyPostAccess} = require("../utils/securityHelper");

const addLike = (req, res) => {
    const idUser = req.user.id;
    const { idPost } = req.body;

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    verifyPostAccess(idPost, idUser, res, (targetPost) => {
        PostLikeModel.addLike(idUser, idPost, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error adding like." });
            }
            return res.status(201).json({ message: "Like added successfully." });
        });
    });
};

const removeLike = (req, res) => {

    const idUser = req.user.id;
    const { idPost } = req.params;

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    PostLikeModel.removeLike(idUser, idPost, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting like." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Like not found." });
        }

        return res.status(200).json({ message: "Like removed successfully." });
    });
};


const getLikesByPost = (req, res) => {
    const  idPost  = req.params.id;

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    PostLikeModel.getLikesByPost(idPost, (err, likes ) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the likes." });
        }

        return res.status(200).json(likes);
    });
};

const getPostLikesByUser = (req, res) => {

    const idUser = req.params.id;

    if (!idUser) {
        return res.status(400).json({ error: "The user ID is required." });
    }

    PostLikeModel.getPostLikesByUser(idUser, (err, likes ) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the user's likes" });
        }

        return res.status(200).json(likes);
    });
};

const getUsersLikePost = (req,res)=>{
    const idPost = req.params.id;

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    PostLikeModel.getUsersLikePost(idPost, (err, users) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the users." });
        }

        return res.status(200).json(users);
    });
};

module.exports = {
    getLikesByPost,
    addLike,
    removeLike,
    getPostLikesByUser,
    getUsersLikePost
};