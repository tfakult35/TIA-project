const express = require('express');

var router = express.Router();

const { getFriends } = require('../../models/usersModel');
const {determineLogInJWT} = require('../../utils/authHelp')


// --------- GET user_id'S FRIENDS: YOU CAN ONLY GET YOUR OWN ---------
router.get('/friends',determineLogInJWT, async (req,res)=>{
    const token_id = req.user();
    if(!token_id){
        return res.status(400).send("Log in is required");
    }

    try{
        const getFriendsResult = await getFriends(user_id);
        return res.status(200).json(getFriendsResult.rows);
    }catch (e){
        return res.status(500).send("Database error");
    }


});





module.exports = router;