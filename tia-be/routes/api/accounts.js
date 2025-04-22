const express = require('express');

var router = express.Router();

const { getFriends, getUser, getUserById } = require('../../models/usersModel');
const {determineLogInJWT} = require('../../utils/authHelp')



// --------- GET username user_desc, CAN GET ANYONE'S, username IN BODY ---------
router.get("/desc/:username", async (req,res) => {
    const username = req.params.username;
    try{
        const getUserResult = await getUser(username);
        if(getUserResult.rowCount === 0){
            return res.status(400).send("No such user");
        }

        return res.status(200).json({'user_id' : getUserResult.rows[0].user_id,
                'username' : getUserResult.rows[0].username, 
                'user_desc' : getUserResult.rows[0].user_desc});

    }catch(e){
        console.log(e);
        return res.status(500).send("Database error");
    }
})

// --------- NO user name required, username user_desc, CAN GET ANYONE'S, username IN BODY ---------
router.get("/desc/", determineLogInJWT, async (req,res) => {
    const token_id = req.user;
    if(token_id === null){
        return res.status(400).send("Invalid login");
    }
    try{
        const getUserResult = await getUserById(token_id);
        if(getUserResult.rowCount === 0){
            return res.status(400).send("No such user");
        }

        return res.status(200).json({'username' : getUserResult.rows[0].username, 'user_desc' : getUserResult.rows[0].user_desc});

    }catch(e){
        return res.status(500).send("Database error");
    }
})


// --------- GET FRIENDS: YOU CAN ONLY GET YOUR OWN ---------
router.get('/friends',determineLogInJWT, async (req,res)=>{
    const token_id = req.user;
    if(!token_id){
        return res.status(400).send("Log in is required");
    }

    try{
        const getFriendsResult = await getFriends(token_id);
        return res.status(200).json(getFriendsResult.rows);
    }catch (e){
        console.log(e);
        return res.status(500).send("Database error");
    }


});






module.exports = router;