const express = require('express');


var router = express.Router();
var {getUser, addUser, getUserById} = require('../../models/usersModel');
var {comparePassword, hashPassword, getToken, verifyToken} = require('../../utils/authHelp.js');



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
                            const token = getToken(userId);
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
                return res.status(402).end();
            }
        })
        .catch((e) => {
            console.log(e);
            return res.status(500).end();
        })
});

router.post("/register", (req,res) =>{
    console.log("in register api");
    const {username,password} = req.body; 
    hashPassword(password).then((hpassword)=>{
    addUser(username,hpassword,"")
        .then( () =>{return res.status(200).end();})
        .catch((error)=>{

            if(error.code === '23505'){
                return res.status(400).end();
            }else{
                return res.status(500).end();
            }
        })
    }).catch(
        () => {return res.status(500).end();}

    )
})

module.exports = router;
