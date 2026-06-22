const db = require('../db_connection/db');

const CommentLikeModel = {

    getLikesByComment: (idComment, callback) => {
        const sql = 'SELECT count(*) AS totalLikes FROM comments_likes WHERE idComment=?';
        db.query(sql, [idComment], callback);
    },

    getUsersLikeComment: (idComment, callback) => {
        const sql = 'SELECT users.* FROM comments_likes JOIN users ON users.id = comments_likes.idUser WHERE idComment = ?';
        db.query(sql, [idComment], callback);
    },

    addLike: (idUser, idComment, callback) => {
        const sql = 'INSERT INTO comments_likes (idUser, idComment) VALUES (?, ?)';
        db.query(sql, [idUser, idComment], callback);
    },

    removeLike: (idUser, idComment, callback) => {
        const sql = 'DELETE FROM comments_likes WHERE idUser=? AND idComment=?';
        db.query(sql, [idUser, idComment], callback);
    }
};

module.exports = CommentLikeModel;