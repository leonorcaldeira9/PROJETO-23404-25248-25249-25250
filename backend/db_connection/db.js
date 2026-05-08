const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fb_db'
});
app.use(express.json());
app.get('/users/:id',(req,res)=>{
    db.query('select * from users where id=?',[req.params.id],(err,result)=>{
        if(err){
            return res.status(500).json();
        }
        res.json(result[0])
    })
});



app.post('/users',(req,res)=>{
    const {fullName,gender,birthDate,maritalStatus,city,country,email,phoneNumber}=req.body;
    db.query('Insert into users(fullName,gender,birthDate,maritalStatus,city,country,email,phoneNumber) values(?,?,?,?,?,?,?,?)',[fullName,gender,birthDate,maritalStatus,city,country,email,phoneNumber],(err,result)=>{
        if (err) {
            return res.status(500).json(err);
        }
        res.json({id:result.insertId,fullName,gender,birthDate,maritalStatus,city,country,email,phoneNumber});
    })
})


app.listen(3000);