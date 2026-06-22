const express = require('express');
const router = express.Router();
const authJWT = require('../middlewares/authJWT');

const { getPostById, createPost, updatePost, deletePost, getPosts,getPostsByUser, getPostsFeed } = require('../controllers/postController');

router.get('/feed', authJWT(), getPostsFeed);

router.get('/:id', authJWT(), getPostById);

router.get('/', authJWT(), getPosts);

router.post('/create', authJWT(), createPost);

router.put('/update/:id', authJWT(), updatePost);

router.delete('/delete/:id', authJWT(), deletePost);

router.get('/user/:id', authJWT(), getPostsByUser);

module.exports = router;