const db = require('../db_connection/db');

const PostModel = {
    getPostById: (id, callback) => {
        //const sql = 'SELECT * FROM posts WHERE id=?';
        const sql = 'SELECT P.*,U.fullName FROM posts AS P JOIN users as U on U.id=P.idUser WHERE P.id=?';
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
    },

    getFeed: (idUser, callback) => {
        const sql = 'SELECT posts.*, users.fullName FROM posts JOIN users ON posts.idUser = users.id WHERE posts.idUser = ? OR posts.idUser IN (SELECT friendId FROM friendship WHERE userId = ? AND friendshipStatus = "F") ORDER BY posts.postDate DESC'
        db.query(sql, [idUser, idUser], callback);
    }
};

module.exports = PostModel;