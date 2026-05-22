const PostLikeModel = require('../models/PostLikeModel');
const {getPostById} = require("../models/postModel");
const {checkIfFriends} = require("../models/friendShipModel");



const addLike = (req, res) => {
    const idUser = req.user.id;
    const { idPost } = req.body;

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    const addLikeFunc = () => {
        PostLikeModel.addLike(idUser, idPost, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error adding like." });
            }

            return res.status(201).json({ message: "Like added successfully." });
        });
    };

    getPostById(idPost, (err, postArray) => {
        if (err) return res.status(500).json({ error: "Database error." });
        if (postArray.length === 0) return res.status(404).json({ error: "Post not found." });

        const targetPost = postArray[0];

        if (targetPost.visibility === 'pr' && targetPost.idUser !== idUser) {

            checkIfFriends(idUser, targetPost.idUser, (err, areFriends) => {
                if (err) return res.status(500).json({ error: "Error checking permissions." });

                if (!areFriends) {
                    return res.status(403).json({ error: "This post is private. You cannot like it." });
                }

                addLikeFunc();
            });
        } else {
            addLikeFunc();
        }
    });
};

const removeLike = (req, res) => {
    /*const { idUser, idPost } = req.params;
    if (!idUser || !idPost) return res.status(400).send();*/

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
    /*if (idPost === undefined) return res.status(400).send();*/

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    PostLikeModel.getLikesByPost(idPost, (err, likes ) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the likes." });
        }

        /*if (likes.length === 0) {
            return res.status(404).json({ error: "Post likes not found." });
        }*/

        return res.status(200).json(likes);
    });
};

const getPostLikesByUser = (req, res) => {
    /*const  idPost  = req.params.id;
    if (idPost === undefined) return res.status(400).send();*/

    const idUser = req.params.id;

    if (!idUser) {
        return res.status(400).json({ error: "The user ID is required." });
    }

    PostLikeModel.getPostLikesByUser(idUser, (err, likes ) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the user's likes" });
        }

        /*if (likes.length === 0) {
            return res.status(404).json({ error: "Post likes not found." });
        }*/

        return res.status(200).json(likes);
    });
};

const getUsersLikePost = (req,res)=>{
    const idPost = req.params.id;
    /*if(idPost === undefined){
        return res.status(400).send();
    }*/

    if (!idPost) {
        return res.status(400).json({ error: "The post ID is required." });
    }

    PostLikeModel.getUsersLikePost(idPost, (err, users) => {
        if (err) {
            return res.status(500).json({ error: "Error searching for the users." });
        }

        /*if (result.length === 0) {
            return res.status(404).json({ error: "User like not found." });
        }*/

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