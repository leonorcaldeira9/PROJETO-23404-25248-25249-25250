const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUserById=(req,res)=>{
    const {id} = req.params;
    UserModel.getUserById(id,(err, user)=>{
        if(err) {
            return res.status(500).json({ error: "Database error." });
        }
        
        if(user.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        
        return res.status(200).json(user[0]);
    })
}

const getUsers=(req,res)=>{
    UserModel.getUsers((err,users)=>{
        if(err){
            return res.status(500).json({ error: "Database error." });
        }

        return res.status(200).json(users);
    })
}

const createUser=(req,res)=>{
    if(!req.body.fullName || !req.body.loginPassword || !req.body.gender || !req.body.birthDate || !req.body.city || !req.body.country || !req.body.email || !req.body.phoneNumber) {
        return res.status(400).json({ error: "Please fill in all required fields." })
    }

    const userBirthDate = new Date(req.body.birthDate);
    const today = new Date();
    const minimumDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
    );

    if (userBirthDate > minimumDate) {
        return res.status(400).json({ error: "You must be at least 16 years old to create an account." });
    }

    const encryptSecurityLevel = 10;

    bcrypt.hash(req.body.loginPassword, encryptSecurityLevel, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: "Error encrypting password." });
        }

        req.body.loginPassword = hash;

        UserModel.createUser(req.body, (err, user) => {
            if(err){
                return res.status(400).send(err);
            }
            return res.status(201).json({ message: "User created successfully." });
        });
    });

}


const loginUser = (req, res) => {
    const { email, loginPassword } = req.body;

    if (!email || !loginPassword) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    UserModel.getUserByEmail(email, (err, results) => {
        if (err) return res.status(500).send();

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = results[0];

        bcrypt.compare(loginPassword, user.loginPassword, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error checking password." });

            if (isMatch) {
                
                const token = jwt.sign(
                    { id: user.id },
                    'volvosSaoBonitos-09-PeugeotsTambem-27-OpelTambem-20-naoTemPopo-13',
                    { expiresIn: '2h' } 
                );
                
                return res.json({
                    message: "Login successfull!",
                    token: token,
                    name: results[0].fullName,
                    id: user.id
                });
            } else {
                return res.status(401).json({ error: "Incorrect password." });
            }
        });


    });
};

const updateUser = (req, res) => {
    const id=req.params.id;
    const loggedInUserId = req.user.id;

    if (!id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    if (parseInt(id) !== loggedInUserId) {
        return res.status(403).json({ error: "Access denied: You can only update your own profile." });
    }

    if(!req.body.fullName || !req.body.gender || !req.body.birthDate || !req.body.city || !req.body.country || !req.body.email || !req.body.phoneNumber) {
        return res.status(400).json({ error: "Please fill in all required fields." })
    }

    if(req.body.maritalSatus === ""){
        req.body.maritalSatus = null;
    }

    if (req.body.loginPassword) {
        const encryptSecurityLevel = 10;

        bcrypt.hash(req.body.loginPassword, encryptSecurityLevel, (err, hash) => {
            if (err) return res.status(500).json({ error: "Error checking password." });

            req.body.loginPassword = hash;

            UserModel.updateUser(id, req.body, (err, result) => {
                if(err) return res.status(500).json({ error: "Error updating." });
                if(result.affectedRows === 0) return res.status(404).json({ error: "User not found." });

                return res.status(200).json({ message: `User ${id} updated successfully.` });
            });
        });
    }
    else {
        UserModel.updateUser(id, req.body, (err, result) => {
            if(err) return res.status(500).json({ error: "Error updating." });
            if(result.affectedRows === 0) return res.status(404).json({ error: "User not found." });

            return res.status(200).json({ message: `User ${id} updated successfully.` });
        });
    }
};

const deleteUser = (req, res) => {
    const  id  = req.params.id;
    const loggedInUserId = req.user.id;

    if (!id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    if (parseInt(id) !== loggedInUserId) {
        return res.status(403).json({ error: "Access denied: You can only delete your own profile." });
    }

    UserModel.deleteUser(id,(err,result)=>{
        if(err){
            return res.status(500).json({ error: "Error deleting from the database" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({ message: `User ${id} deleted successfully.` });
    })
};


module.exports = {
    getUserById,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};