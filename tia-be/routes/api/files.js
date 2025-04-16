const express = require('express');

var router = express.Router();


var {getUserFileHeaders,getFileOwner, getFileContent, createNewFile} = require('../../models/filesModel');
var {determineLogInJWT,getRelativePrivilege} = require('../../utils/authHelp');
const { getUserGroups } = require('../../models/users');


//----- CREATE NEW BLANK FILE WITH file_name AND a_v = 5 OWNED BY USER -----
router.post("/user/", determineLogInJWT, async(req,res)=>{
    const token_id = req.user;
    if(!token_id){
        return res.status(401).send("You are not logged in");
    }else{
        //check if parent_file_id are viable
        const {file_name, parent_file_id} = req.body;
        try{
            if(parent_file_id !== null){
                const parentTest = await getFileOwner(parent_file_id);
                if(parentTest.rows[0].user_id !== token_id){
                    return res.status(403).send("The parent file provided is not your file")
                }
            }

            const createNewFileResult = await createNewFile(token_id, file_name, parent_file_id);
            return res.status(200).json(createNewFileResult); //SENDING THE MODIFIED_TIME AND FILE_ID BACK

        }
        catch (e){
            console.log(e);
            res.status(500).send(e); 
        }
    }

})


//------ GET OWN FILE HEADERS ------
router.get("/user/own", determineLogInJWT, async(req,res) => {
    const token_id = req.user;
    if(!token_id){
        console.log("NOT LOGGED IN");
        return res.status(401).send("You are not logged in");
    }
    else{
        try{
            const userFileResult = await getUserFileHeaders(token_id,5);
            return res.status(200).json(userFileResult.rows)
        }catch (e){
            console.log(e);
            return res.status(500);
        }
    }
})

//------ GET user-id FILE HEADERS; access control ------
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



//------ GET THE CONTENT OF file_id; access control ------
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
                res.status(403).send("Privl fault");
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