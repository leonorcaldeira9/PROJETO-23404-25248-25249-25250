const express = require('express');
const router = express.Router();

const authJWT = require("../middlewares/authJWT");

const { createComment , getCommentById , getCommentsByPost , updateComment , deleteComment} = require('../controllers/commentController');

router.post('/create', authJWT(), createComment);

router.get('/:id', authJWT(), getCommentById);

router.get('/post/:idPost', authJWT(), getCommentsByPost);

router.put('/update/:id', authJWT(), updateComment);

router.delete('/delete/:id', authJWT(), deleteComment);

module.exports = router;