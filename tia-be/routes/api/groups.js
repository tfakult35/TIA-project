const express = require('express');
const {searchGroups, getGroupMembers,getGroup, createGroup, leaveGroup} = require('../../models/groupModels');
const {groupCheck} = require('../../models/usersModel')
const {determineLogInJWT,logInRequire} = require('../../utils/authHelp');

var router = express.Router('../../utils/usersModel');

/****CREATE NEW GROUP *****/

router.post('/', determineLogInJWT, logInRequire, async (req,res)=>{
    const token_id = req.user;
    const group_name = req.body["group_name"];
    
    if(!group_name){
        return res.status(400).send("Invalid group name")
    }

    try{
        await createGroup(token_id,group_name);
        return res.status(200).end();
    }catch (e){
        console.log(e);
        return res.status(500).send("API error");
    }

})

/*****LEAVE GROUP *********/
router.delete('/',determineLogInJWT,logInRequire, async(req,res)=>{
    const token_id = req.user;
    const group_name = req.body["group_name"];

    if(!group_name){
        return res.status(400).send("Invalid group name");
    }


    try{
        const getGroupResult = await getGroup(group_name);
        if(getGroup.rowCount ===0){
            return res.status(404).send("No such group");
        }

        const group_id = getGroupResult.rows[0].group_id;

        await leaveGroup(token_id,group_id);

        return res.status(200).end();



        
    }catch (e){
        console.log(e);
        return res.status(500).send("API error")
    }

})

/*****SEARCH GROUPS BY PREFIX *****/
router.get('/search/:prefix', async (req,res)=>{
    const prefix = req.params.prefix;

    if(prefix === undefined) return res.status(404).send("Missing content")
    
    try{
        const searchGroupResult = await searchGroups(prefix);
        return res.status(200).json(searchGroupResult.rows);

    }catch (e){
        console.log(e);
        return res.status(500).send("Api error")
    }
})


router.get('/members/:group_name',determineLogInJWT,logInRequire, async (req,res)=>{
    
    const group_name = req.params.group_name
    const token_id = req.user;

    try{//todo username

        const groupResult = await getGroup(group_name);
        if(groupResult.rowCount === 0){
            return res.status(404).send("No such group")
        }

        const group_id = groupResult.rows[0].group_id;
        
        if((await groupCheck(token_id,group_id)).rowCount === 0){
            return res.status(401).send("No permission")
        }

        return res.status(200).json((await getGroupMembers(group_name)).rows);
    }catch (e){
        console.log(e);
        return res.status(500).send("Api error")
    }
})





module.exports = router;