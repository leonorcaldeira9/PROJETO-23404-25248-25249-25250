var express = require('express');
var router = express.Router();

const db = require('../db_connection/db');
const app = express();

app.use(express.json());

app.get('/users/:id',(req,res)=> {
  db.query('select * from users where id=?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json();
    }
    res.json(result[0])
  })
});



app.post('/users',(req,res)=>{
  const {fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber}=req.body;
  db.query('Insert into users(fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber) values(?,?,?,?,?,?,?,?,?)',[fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber],(err,result)=>{
    if (err) {
      return res.status(500).json(err);
    }
    res.json({id:result.insertId,fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber});
  })
})

app.listen(3001, () => {
  console.log('Servidor Express a correr na porta 3001!');
});

module.exports = router;