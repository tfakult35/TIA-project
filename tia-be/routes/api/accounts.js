const express = require('express');
const sanitizeHtml = require('sanitize-html');

var router = express.Router();

const { getFriends, getUser, getUserById, getFriendsRequests, 
        createFriendsRequests, checkFriendship, acceptFriendsRequests, 
        getAllFriendsRequests, deleteFriendsRequests, deleteFriendship,
        updateUserDesc,getGroups,
        searchUsers} = require('../../models/usersModel');
const {determineLogInJWT} = require('../../utils/authHelp')


//--------------POST bio, your own--------------
router.post("/bio/",determineLogInJWT,async (req,res)=>{
    const token_id = req.user;


    const unsanitizedContent = req.body.content; //sanitize html middleware
    if(!unsanitizedContent){
        return res.status(404).send("Missing content");
    }
        //sanitize html
    const sanitizedContent = sanitizeHtml(unsanitizedContent);
    
    if(token_id === null){
        return res.status(401).send("Invalid login")
    }

    try{
        await updateUserDesc(token_id,sanitizedContent);
        return res.sendStatus(200);
    }catch(e){
        return res.sendStatus(500);
    }
    


})





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


// -------- CHECK FRIENDSHIP 0 - not friends, 1 friends, 2 request pending (req = token_id), 3 YOUR ACCOUNT, token_id, username --------

router.get('/friends/:username', determineLogInJWT, async(req,res)=>{
   const token_id = req.user;
   const username = req.params.username;
   if(token_id === null){
        return res.status(400).send("Invalid login")
   }

   

   try{
        const getUserResult = await getUser(username);
        if(getUserResult.rowCount === 0){
             return res.status(400).send("No such user");
        }

        const target_id = getUserResult.rows[0].user_id;
        if(token_id === target_id) return res.status(200).json({"isFriend":3});

        const checkFriendshipResult = await checkFriendship(token_id,target_id);
        const getFriendsRequestsResult = await getFriendsRequests(token_id, target_id); 
        
        if(checkFriendshipResult.rowCount !== 0){
            return res.status(200).json({"isFriend":1});
        }else{
            if(getFriendsRequestsResult.rowCount !== 0){
                return res.status(200).json({"isFriend":2});
            }else{
                return res.status(200).json({"isFriend":0});
            }
        }
    

   }catch (e){
        return res.status(500).send("Database error");
   }
})

// -------- SEND AND ACCEPT FRIEND REQUEST ----------

// if already friends: 
//          return 400 - already friends
// if already exists where req=token_id, rec=user_id: 
//          return 400 - already sent
// if already exists where req=user_id, rec=token_id:        >>>ACCEPT FRIEND REQUEST<<<
//          ADD (user_id, token_id) into friendships, 
//          DELETE (user_id,token_id) from friends_requests, 
//          return 200
// if else:                                                  >>>SEND FRIEND REQUEST<<<
//          ADD (req=token_id, rec=user_id) into friends_requests, 
//          return 200 (PENDING)
// returns Added 
router.post('/friends/:username', determineLogInJWT, async(req,res)=>{
    const token_id = req.user;
    const username = req.params.username;
    if(token_id === null){
        return res.status(401).send("Invalid login");
    }

    try{
        const getUserResult = await getUser(username);
        if(getUserResult.rowCount === 0){
            return res.status(404).send("No such user");
        }

        const target_id = getUserResult.rows[0].user_id;

        if(target_id === token_id){
            return res.status(400).send("Can't add yourself!");
        }

        const getFriendsResult = await checkFriendship(token_id,target_id);
        if(getFriendsResult.rowCount !== 0){
            return res.status(400).send("Already friends");
        }

        const reqCheckResult = await getFriendsRequests(token_id,target_id);
        if(reqCheckResult.rowCount !== 0){
            return res.status(400).send("Already sent")
        }

        //SEND OR ACCEPT FRIEND REQUEST:

        const recCheckResult = await getFriendsRequests(target_id,token_id);

        
        if(recCheckResult.rowCount === 0){
            //SEND FRIEND REQUEST
            await createFriendsRequests(token_id,target_id);
            return res.status(200).json({"Added": false});
        }else{
            //ACCEPT FRIEND REQUEST
            await acceptFriendsRequests(target_id, token_id);
            return res.status(200).json({"Added": true});
        }


    }catch (e){
        return res.status(500).send("Database error");
    }
})


// ---------- DELETE FRIENDSHIP/CANCEL FRIENDREQUEST ---------------
// deletes friendship or cancels friend request whether the caller is on rec side or req side of the request
// should this be the same api call? Probably doesn't matter
router.delete('/friends/:username',determineLogInJWT, async (req,res)=>{
    const token_id = req.user
    const username = req.params.username;



    if(token_id === null){
        return res.status(401).send("Log in is required");
    }

    try{


        const getUserResult = await getUser(username);
        if(getUserResult.rowCount === 0){
            return res.status(404).send("No such user");
        }

        const target_id = getUserResult.rows[0].user_id;

       
        const getFriendsResult = await checkFriendship(token_id,target_id);
        const reqCheckResult1 = await getFriendsRequests(token_id,target_id);
        const reqCheckResult2 = await getFriendsRequests(target_id,token_id);

        const reqCheckResultSize = reqCheckResult1.rowCount + reqCheckResult2.rowCount;

        

        if(getFriendsResult.rowCount === 0 && reqCheckResultSize === 0){
            return res.status(404).send("No such friendship/friend request");
        }

        if(getFriendsResult.rowCount > 0){
            await deleteFriendship(token_id,target_id);
        }

        if(reqCheckResultSize > 0){
            await deleteFriendsRequests(token_id, target_id);
        }

        return res.status(200).end();
        


    }catch (e){
        return res.status(500).send("Database error");
    }

})

// --------- GET FRIENDS: YOU CAN ONLY GET YOUR OWN ---------
router.get('/friends',determineLogInJWT, async (req,res)=>{
    const token_id = req.user;
    if(token_id === null){
        return res.status(401).send("Log in is required");
    }

    try{
        const getFriendsResult = await getFriends(token_id);
        return res.status(200).json(getFriendsResult.rows);
    }catch (e){
        console.log(e);
        return res.status(500).send("Database error");
    }


});




// --------- GET FRIENDSREQUESTS: YOU CAN ONLY GET YOUR OWN ---------
router.get('/friends_requests',determineLogInJWT, async (req,res)=>{
    const token_id = req.user;
    if(!token_id){
        return res.status(400).send("Log in is required");
    }


    try{
        const getAllFriendReqsResult = await getAllFriendsRequests(token_id);
        return res.status(200).json(getAllFriendReqsResult.rows);
    }catch (e){
        console.log(e);
        return res.status(500).send("Database error");
    }


});



/*------- GET USER GROUPS--------- */
router.get('/groups',determineLogInJWT, async (req,res)=>{
    const token_id = req.user;
    if(token_id === null){
        return res.status(401).send("Log in is required");
    }

    try{
        const result = await getGroups(token_id);
        return res.status(200).json(result.rows);
    }catch (e){
        console.log(e);
        return res.status(500).send("Database error");
    }


});


/*****SEARCH USERS BY PREFIX *****/
router.get('/search/:prefix', async (req,res)=>{
    const prefix = req.params.prefix;

    if(prefix === undefined) return res.status(404).send("Missing content")
    
    try{
        const searchUsersResult = await searchUsers(prefix);
        return res.status(200).json(searchUsersResult.rows);

    }catch (e){
        console.log(e);
        return res.status(500).send("Database error")
    }
})



module.exports = router;