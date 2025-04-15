const express = require('express');

var router = express.Router();


var {getUserFiles,getFileOwner} = require('../../models/noteFiles');
var {determineLogInJWT,getRelativePrivilege} = require('../../utils/authHelp');

router.get("/user/:user_id", determineLogInJWT, async (req,res)=>{
    const target_id = parseInt(req.param.user_id);
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

//get content of file
router.get("/:file_id/content", determineLogInJWT, async (req, res) =>{
    const target_file_id = parseInt(req.param.file_id);
    const token_id = req.user?.user_id;                                 //!!! determineLogInJwt

    try{
        const fileOwnerResult = await getFileOwner(target_file_id); 
        if(fileOwnerResult.rowCount === 0){
            console.log("NO such file");
            return res.status(400);
        }else{
            const file_owner_id = fileOwnerResult.rows[0].user_id;
            const privl = await getRelativePrivilege(token_id, file_owner_id);
            
        }
    }
    catch (e){
        console.log(e);
        res.status(500);
    }

});



module.exports = router;