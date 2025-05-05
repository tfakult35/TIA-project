const express = require('express');
const {searchGroups} = require('../../models/groupModels');
var router = express.Router();

/*****SEARCH GROUPS BY PREFIX *****/
router.get('/search/:prefix', async (req,res)=>{
    const prefix = req.params.prefix;

    if(prefix === undefined) return res.status(404).send("Missing content")
    
    try{
        const searchGroupResult = await searchGroups(prefix);
        console.log(searchGroupResult);
        return res.status(200).json(searchGroupResult.rows);

    }catch (e){
        console.log(e);
        return res.status(500).send("Database error")
    }
})


module.exports = router;