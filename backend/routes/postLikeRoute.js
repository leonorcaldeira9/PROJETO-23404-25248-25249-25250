const express = require('express');
const router = express.Router();

const { addLike, removeLike, getLikesByPost, getPostLikesByUser, getUsersLikePost} = require('../controllers/postLikeController');
const authJWT = require("../middlewares/authJWT");

router.post('/add', authJWT(), addLike);

router.delete('/delete/:idPost', authJWT(), removeLike);

router.get('/count/:id', authJWT(), getLikesByPost);

router.get('/user/:id', authJWT(), getPostLikesByUser);

router.get('/usersLikePost/:id', authJWT(), getUsersLikePost);

module.exports = router;