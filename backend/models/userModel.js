const db = require('../db_connection/db');

const UserModel = {

    getUserById: (id, callback) => {
        const sql = 'SELECT * FROM users WHERE id=?';
        db.query(sql, [id], callback);
    },

    getUsers: (callback)=>{
        const sql = 'SELECT * FROM users';
        db.query(sql,callback);
    } ,

    createUser: (userData, callback) => {
        const { fullName, loginPassword, gender, birthDate, maritalStatus, city, country, email, phoneNumber } = userData

        let privacy= userData.privacy || 'pr'


        const sql = 'INSERT INTO users(fullName,loginPassword,privacy,gender,birthDate,maritalStatus,city,country,email,phoneNumber) VALUES(?,?,?,?,?,?,?,?,?,?)';

        db.query(sql, [fullName, loginPassword, privacy, gender, birthDate, maritalStatus, city, country, email, phoneNumber], callback);

    },

    updateUser: (id, userData, callback) => {

        const { fullName, loginPassword, gender, birthDate, maritalStatus, city, country, email, phoneNumber } = userData;

        let privacy = userData.privacy || 'pr';
        if(loginPassword){
            const sql = 'UPDATE users SET fullName=?,loginPassword=?,privacy=?,gender=?,birthDate=?,maritalStatus=?,city=?,country=?,email=?,phoneNumber=? WHERE id=?';

            db.query(sql, [fullName, loginPassword, privacy, gender, birthDate, maritalStatus, city, country, email, phoneNumber, id], callback);
        }
        else{
            const sql = 'UPDATE users SET fullName=?,privacy=?,gender=?,birthDate=?,maritalStatus=?,city=?,country=?,email=?,phoneNumber=? WHERE id=?';

            db.query(sql, [fullName, privacy, gender, birthDate, maritalStatus, city, country, email, phoneNumber, id], callback);
        }

    },


    deleteUser: (id, callback) => {
        const sql = 'DELETE FROM users WHERE id=?';
        db.query(sql, [id], callback);
    },

    getUserByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email=?';
        db.query(sql, [email], callback);
    },
};

module.exports = UserModel;