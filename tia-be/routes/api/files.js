const express = require('express');

var router = express.Router();


var {getUserFileHeaders,getFileOwner, getFileContent} = require('../../models/filesModel');
var {determineLogInJWT,getRelativePrivilege} = require('../../utils/authHelp');
const { getUserGroups } = require('../../models/users');



//need to make a group file get as well

router.get("/user/own", determineLogInJWT, async(req,res) => {
    const token_id = req.user;
    if(!token_id){
        return res.status(401).send("You are not logged in");
    }
    else{
        try{
            const userFileResult = await getUserFileHeaders(token_id,5);
            console.log(userFileResult.rows);
            return res.status(200).json(userFileResult.rows)
        }catch (e){
            console.log(e);
            return res.status(500);
        }
    }
})

//CHECK for notes with inaccessabile parents - should not happen as a child can not have a smaller access value than parent
router.get("/user/:user_id", determineLogInJWT, async (req,res)=>{
    const target_id = parseInt(req.params.user_id);
    const token_id = req.user;
    
    try{
        const privl = await getRelativePrivilege(token_id,target_id);
        const userFileResult = await getUserFileHeaders(target_id,privl);
        return res.status(200).json(userFileResult.rows);

    } catch(e){
        console.log(e);
        return res.status(500);
    }
}
);


//get content of file, have to check if initiator has the right privl
router.get("/:file_id/content", determineLogInJWT, async (req, res) =>{
    const target_file_id = parseInt(req.params.file_id);
    const token_id = req.user;                                 

    try{
        const fileOwnerResult = await getFileOwner(target_file_id); 
        if(fileOwnerResult.rowCount === 0){
            console.log("NO such file");
            return res.status(400).send("No such file");
        }else{
            const file_owner_id = fileOwnerResult.rows[0].user_id;
            const privl = await getRelativePrivilege(token_id, file_owner_id);
            
            let groups = [];
            if(token_id){
                const groupsResult = await getUserGroups(token_id);
                groups = groupsResult.rows.map(x => x.group.id);
            }

            const getContentResult = await getFileContent(target_file_id,privl,groups);
            
            if(getContentResult.rowCount === 0){
                console.log("Privl fault");
                res.status(400).send("Privl fault");
            }else{
                const content = getContentResult.rows[0].content;
                res.status(200).json(content);
            }

        }
    }
    catch (e){
        console.log(e);
        res.status(500);
    }

});



module.exports = router;