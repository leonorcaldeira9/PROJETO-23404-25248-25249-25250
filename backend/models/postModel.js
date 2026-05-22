const db = require('../db_connection/db');

const PostModel = {
    getPostById: (id, callback) => {
        const sql = 'SELECT * FROM posts WHERE id=?';
        db.query(sql, [id], callback);
    },

    getPosts: (callback) => {
        const sql = 'SELECT * FROM posts ORDER BY postDate DESC';
        db.query(sql, callback);
    },

    getPostsByUser: (idUser, callback) => {
        const sql = 'SELECT * FROM posts WHERE idUser=? ORDER BY postDate DESC';
        db.query(sql, [idUser], callback);
    },

    createPost: (postData, callback) => {
        const sql = 'INSERT INTO posts (idUser, postText, visibility) VALUES (?, ?, ?)';
        db.query(sql, [postData.idUser, postData.postText, postData.vis], callback);
    },

    updatePost: (id, postText, vis, callback) => {
        const sql = 'UPDATE posts SET postText=?, visibility = ? WHERE id=?';
        db.query(sql, [postText, vis, id], callback);
    },

    deletePost: (id, callback) => {
        const sql = 'DELETE FROM posts WHERE id=?';
        db.query(sql, [id], callback);
    }
};

module.exports = PostModel;