const bcrypt = require('bcrypt');
const saltRounds = 10;

//
const {checkFriendship} = require('../models/usersModel')

//token auth
const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;

// returns promise!
const hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
};

// returns promise!
const comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

const getToken = (user_id) => {
    return jwt.sign({ "user_id": user_id},
                    JWT_SECRET);
};

// valid token/invalid token + no token, middleware RETURN UNDEFINED
function determineLogInJWT(req,res,next){
    const token = req.headers["authorization"]; //header only includes token
    if(!token){
        req.user = undefined;
    }else{

        try {
            const tokenContent = jwt.verify(token, JWT_SECRET);
            req.user = tokenContent.user_id;
        } catch (err) {
            req.user = undefined;
        }
        
    }
    next();
}

async function getRelativePrivilege(token_id,target_id){
    console.log("IN GET RELATIVE PRIVL")
    
    if(!token_id){
        return 0;
    }

    if(token_id === target_id){
        return 5;
    }

    const friends = await checkFriendship(token_id,target_id);
    return friends.rowCount !== 0 ? 1 : 0;

}


module.exports = { hashPassword, comparePassword, getToken, determineLogInJWT, getRelativePrivilege};