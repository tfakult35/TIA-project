const express = require('express');

var router = express.Router();


var {getUserFiles,getFileOwner, getFileContent} = require('../../models/noteFiles');
var {determineLogInJWT,getRelativePrivilege} = require('../../utils/authHelp');
const { getUserGroups } = require('../../models/users');

router.get("/user/:user_id", determineLogInJWT, async (req,res)=>{
    const target_id = parseInt(req.params.user_id);
    const token_id = req.user?.user_id;
    
    try{
        const privl = await getRelativePrivilege(target_id,token_id);
        const userFileResult = await getUserFiles(target_id,privl);
        return res.json(userFileResult.rows);

    } catch(e){
        console.log(e);
        return res.status(500);
    }
}
);

//get content of file, have to check if initiator has the right privl
router.get("/:file_id/content", determineLogInJWT, async (req, res) =>{
    const target_file_id = parseInt(req.params.file_id);
    const token_id = req.user?.user_id;                                 //!!! determineLogInJwt

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
                res.json(content);
            }

        }
    }
    catch (e){
        console.log(e);
        res.status(500);
    }

});



module.exports = router;