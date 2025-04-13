const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;

var router = express.Router();
var {getUser} = require('../../models/users');
var {comparePassword, hashPassword} = require('../../utils/authHelp.js');



router.post("/", (req, res) => {
    console.log("in login api");
    const { username, password } = req.body;
    console.log(username);
    getUser(username)
        .then((result) => {   
            if (result.rows && result.rows.length === 1) {                
                const userId = result.rows[0].user_id;
                const hashedPassword = result.rows[0].password; 
                
                console.log(hashedPassword);
                console.log(password);               
                
                comparePassword(password, hashedPassword)
                    .then((isValid) => {
                        if (isValid) {
                            const token = jwt.sign({ user_id: userId},
                                JWT_SECRET);  //token
                            console.log("Log in success");
                            return res.status(201).json({token});
                        }
                        // invalid password
                        else {
                            console.log("Invalid password");
                            return res.status(401).end();
                        }
                    })
                    .catch((e) => { 
                        console.log(e); 
                        console.log("Server error")
                        res.status(500).end(); 
                    })
            }
            // user does not exist
            else {
                console.log("User does not exist");
                return res.status(401).end();
            }
        })
        .catch((e) => {
            console.log(e);
            return res.status(500).end();
        })
});


module.exports = router;
