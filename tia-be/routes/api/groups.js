const express = require('express');
const {searchGroups, getGroupMembers,getGroup} = require('../../models/groupModels');
const {groupCheck} = require('../../models/usersModel')
const {determineLogInJWT,logInRequire} = require('../../utils/authHelp');

var router = express.Router('../../utils/usersModel');

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