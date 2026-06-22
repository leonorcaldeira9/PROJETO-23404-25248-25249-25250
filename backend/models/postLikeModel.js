const db = require('../db_connection/db');

const PostLikeModel = {
    getLikesByPost: (idPost, callback) => {
        const sql = 'SELECT count(*) AS likes FROM posts_likes WHERE idPost=?';
        db.query(sql, [idPost], callback);
    },

    addLike: (idUser, idPost, callback) => {
        const sql = 'INSERT INTO posts_likes (idUser, idPost) VALUES (?, ?)';
        db.query(sql, [idUser, idPost], callback);
    },

    removeLike: (idUser, idPost, callback) => {
        const sql = 'DELETE FROM posts_likes WHERE idUser=? AND idPost=?';
        db.query(sql, [idUser, idPost], callback);
    },

    getPostLikesByUser: (id, callback)=>{
        const sql = 'SELECT P.* FROM posts_likes AS PL JOIN posts AS P ON PL.idPost = P.id WHERE PL.idUser = ? ORDER BY PL.likeDate DESC';
        db.query(sql, [id], callback);

    },

    getUsersLikePost: (idPost, callback)=>{
        const sql = 'SELECT users.* FROM posts_likes JOIN users ON users.id = posts_likes.idUser WHERE idPost = ?'
        db.query(sql, [idPost], callback);
    }
};

module.exports = PostLikeModel;