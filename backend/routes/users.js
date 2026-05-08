const express = require('express');

const user=express.Router();
const db = require('../db_connection/db');


user.get('/:id', (req,res)=> {
  db.query('select * from users where id=?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json();
    }
    res.json(result[0])
  })
});



user.post('/',(req,res)=>{
  const {fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber}=req.body;
  db.query('Insert into users(fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber) values(?,?,?,?,?,?,?,?,?)',[fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber],(err,result)=>{
    if (err) {
      return res.status(500).json(err);
    }
    res.json({id:result.insertId,fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber});
  })
});


user.put('/:id',(req,res)=>{
  const {fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber}=req.body;
  db.query('update users set fullName=?,loginPassword=?,gender=?,birthDate=?,maritalStatus=?,city=?,country=?,email=?,phoneNumber=? where id=?',
      [fullName,loginPassword,gender,birthDate,maritalStatus,city,country,email,phoneNumber,req.params.id],(err,result)=>{
    if (err) {
      return res.status(500).json(err);
    }
    res.json("Adicionado com sucesso");
  })
});



user.delete('/:id',(req,res)=>{
  const {id} = req.params;
  db.query('delete on cascade  from users where id=?',[id],(err,result)=>{})
})





module.exports = user;