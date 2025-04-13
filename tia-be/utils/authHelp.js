const bcrypt = require('bcrypt');
const saltRounds = 10;

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

const getToken = (userId) => {
    return jwt.sign({ user_id: userId},
                    JWT_SECRET);
};

const verifyToken = (token) => {
    try {
        token.verify(token,JWT_SECRET);
        return true;
    }catch (error){
        return false;
    }
};

module.exports = { hashPassword, comparePassword, getToken, verifyToken };