const db = require('../db_connection/db');

const CommentModel = {
    getCommentById: (id, callback) => {
        const sql = 'SELECT * FROM comments WHERE id=?';
        db.query(sql, [id], callback);
    },

    getCommentsByPost: (idPost, callback) => {
        const sql = 'SELECT C.*,U.fullName FROM comments as C join users as U on C.idUser=U.id WHERE idPost=? ORDER BY commentDate ASC';
        db.query(sql, [idPost], callback);
    },

    createComment: (commentData, callback) => {
        const { idPost, idUser, parentCommentId, commentText } = commentData;
        const sql = 'INSERT INTO comments (idPost, idUser, parentCommentId, commentText) VALUES (?, ?, ?, ?)';
        db.query(sql, [idPost, idUser, parentCommentId, commentText], callback);
    },

    updateComment: (id, commentText, callback) => {
        const sql = 'UPDATE comments SET commentText=? WHERE id=?';
        db.query(sql, [commentText, id], callback);
    },

    deleteComment: (id, callback) => {
        const sql = 'DELETE FROM comments WHERE id=?';
        db.query(sql, [id], callback);
    }
};

module.exports = CommentModel;