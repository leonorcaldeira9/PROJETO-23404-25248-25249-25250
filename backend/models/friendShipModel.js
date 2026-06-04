const db = require('../db_connection/db');

const FriendshipModel = {

    getFriendshipStatus: (userId, friendId, callback) => {
        const sql = 'SELECT friendshipStatus FROM friendship WHERE userId=? AND friendId=?';
        db.query(sql, [userId, friendId], callback);
    },

    getFriendsByUser: (userId, callback) => {
        const sql = `
            SELECT U.id, U.fullName, U.city FROM friendship AS F JOIN users AS U ON U.id = F.friendId WHERE F.userId = ? AND F.friendshipStatus = 'F'
        `;
        db.query(sql, [userId], callback);
    },


    createFriendRequest: (userId, friendId, callback) => {
        const sql = 'INSERT INTO friendship (userId, friendId, friendshipStatus) VALUES (?, ?, "P")';
        db.query(sql, [userId, friendId], callback);
    },


    updateFriendshipStatus: (userId, friendId, status, callback) => {


        const sqlUpdate = 'UPDATE friendship SET friendshipStatus=?, friendDate=CURRENT_TIMESTAMP WHERE userId=? AND friendId=?';

        db.query(sqlUpdate, [status, userId, friendId], (err, result) => {
            if (err) return callback(err, null);

            if (result.affectedRows === 0) return callback(null, result);

            if (status === 'F') {

                const sqlInsertReverse = `
                    INSERT INTO friendship (userId, friendId, friendshipStatus, friendDate) 
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
                    ON DUPLICATE KEY UPDATE friendshipStatus=?, friendDate=CURRENT_TIMESTAMP
                `;

                db.query(sqlInsertReverse, [friendId, userId, status, status], (errReverse, resultReverse) => {
                    if (errReverse) return callback(errReverse, null);


                    return callback(null, result);
                });
            } else {

                return callback(null, result);
            }
        });
    },


    deleteFriendship: (user1, user2, callback) => {
        const sql = 'DELETE FROM friendship WHERE (userId=? AND friendId=?) OR (userId=? AND friendId=?)';
        db.query(sql, [user1, user2, user2, user1], callback);
    },

    checkIfFriends: (user1, user2, callback) => {
        if (parseInt(user1) == parseInt(user2)) {
            return callback(null, true);
        }

        const sql = "SELECT * FROM friendship WHERE userId=? AND friendId=? AND friendshipStatus='F'";

        db.query(sql, [user1, user2], (err, result) => {
            if (err){
                return callback(err, null);
            }

            if (result.length === 0) {
                return callback(null, false);
            } else {
                return callback(null, true);
            }
        });
    },

    getPendingRequests: (idUser, callback) => {
        const sql = 'SELECT U.id, U.fullName, U.email, F.friendDate FROM friendship AS F JOIN users AS U ON U.id = F.userId AND U.id != ? WHERE ( F.friendId = ?) AND F.friendshipStatus = "P"';
        db.query(sql, [idUser, idUser], callback);
    }
};

module.exports = FriendshipModel;