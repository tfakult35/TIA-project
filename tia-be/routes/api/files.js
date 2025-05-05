const express = require('express');
const sanitizeHtml = require('sanitize-html');

var router = express.Router();


var {getUserFileHeaders,getFileOwner, getFileContent, 
    createNewFile, setContent,removeFile,renameFile,
    setPrivl, privlCheck, getGroupFileHeaders} = require('../../models/filesModel');
var {determineLogInJWT,getRelativePrivilege,logInRequire} = require('../../utils/authHelp');
const { getUserGroups, getAmountOfNotes, getUser, groupCheck } = require('../../models/usersModel');
const { getGroup } = require('../../models/groupModels');



// --------------- GROUP FILES --------------

router.get("/groups/:group_name", determineLogInJWT, logInRequire, async(req,res)=>{
    const token_id = req.user;
    const group_name = req.params.group_name;

    console.log("group name",group_name);
    
    
    try{
        const getGroupResult = await getGroup(group_name);
        if(getGroupResult.rowCount === 0){
            return res.status(404).send("No such group")
        }

        const group_id = getGroupResult.rows[0].group_id;
        const groupCheckResult = await groupCheck(token_id,group_id);

        if(groupCheckResult.rowCount === 0){
            return res.status(401).send("You do not have permission to view this group");
        }

        const filesResult = await getGroupFileHeaders(group_id);
        return res.status(200).json(filesResult.rows);


    }catch(e){
        console.log(e);
        return res.status(500).send("Database error");
        
    }
    

})


//----- CREATE NEW BLANK FILE WITH file_name AND a_v = 5 OWNED BY USER -----
router.post("/user/", determineLogInJWT, async(req,res)=>{
    const token_id = req.user;
    if(token_id === undefined){
        return res.status(401).send("You are not logged in");
    }else{
        //check if not exceeded file amount limit (200 notes)
        try{
            const result = await getAmountOfNotes(token_id);
            console.log(result.rows[0].file_count);
            if(result.rows[0].file_count > 199){
                res.status(400).end();
            }

        }catch (e){
            console.log(e);
            res.status(500).end();
        }

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
router.get("/user/", determineLogInJWT, logInRequire,  async(req,res) => {
    const token_id = req.user;
    

    try{
        const userFileResult = await getUserFileHeaders(token_id,5);
        return res.status(200).json(userFileResult.rows)
    }catch (e){
        console.log(e);
        return res.sendStatus(500);
    }

})

//------ GET user-id FILE HEADERS; access control ------
router.get("/user/:username", determineLogInJWT, async (req,res)=>{
    const user = req.params.username;
    const token_id = req.user;
    

    try{

        const getUserResult = await getUser(user)
        if(getUserResult.rowCount === 0){
            return res.status(404).send("No such user");
        } 

        const target_id = getUserResult.rows[0].user_id;
        console.log("user_id",target_id)

        const privl = await getRelativePrivilege(token_id,target_id); //doesnt check for GROUPS! must make seperate group get
        console.log("privl",privl);
        const userFileResult = await getUserFileHeaders(target_id,privl);
        return res.status(200).json(userFileResult.rows);

    } catch(e){
        console.log(e);
        return res.sendStatus(500);
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
                groups = groupsResult.rows.map(x => x.group_id);
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
        res.sendStatus(500);
    }

});


//------ SET THE CONTENT OF file_id, only owner of file; access control ------
router.post('/:file_id/content',determineLogInJWT,logInRequire, async(req,res)=>{
    console.log("IN SET CONTENT api");
    const target_file_id = parseInt(req.params.file_id);
    const token_id = req.user;
    const unsanitizedContent = req.body.content;
    if(!unsanitizedContent){
        return res.status(400).send("Missing content");
    }
    //sanitize html
    const sanitizedContent = sanitizeHtml(unsanitizedContent);

    
    try{
        fileOwnerResult = await getFileOwner(target_file_id);
        if(fileOwnerResult.rowCount === 0){
            res.status(404).send("No such file");
        }

        if(fileOwnerResult.rows[0].user_id !== token_id){
            return res.status(403).send("You are not the owner of this file");
        }else{
            await setContent(target_file_id, sanitizedContent);
            return res.sendStatus(200);
        }
    }catch{
        return res.sendStatus(500);
    }
    

})

//RENAME file_id
router.post("/:file_id/name",determineLogInJWT, logInRequire, async(req,res) =>{

    const token_id = req.user;
    const file_name = req.body.file_name;
    const target_file_id = parseInt(req.params.file_id);

    if(!file_name){
        return res.status(400).send("Missing content");
    }

    const cleanName = file_name.replace(/[^a-zA-Z0-9]/g, '');
    if(file_name !== cleanName){
        return res.status(400).send("Bad characters");
    }

    try{
        fileOwnerResult = await getFileOwner(target_file_id);
        if(fileOwnerResult.rowCount === 0){
            res.status(404).send("No such file");
        }

        if(fileOwnerResult.rows[0].user_id !== token_id){
            return res.status(403).send("You are not the owner of this file");
        }else{
            await renameFile(target_file_id, file_name);
            return res.sendStatus(200);
        }
    }catch (e){
        console.log(e);
        return res.sendStatus(500);
    }
})

//CHANGE ACCESS CONTROL file_id
router.post("/:file_id/access",determineLogInJWT, logInRequire, async(req,res) =>{

    console.log("IN access CONTENT api");

    const target_file_id = parseInt(req.params.file_id);
    const token_id = req.user;
    const privl = parseInt(req.body.privl);

    if(privl === NaN || privl < 0 || privl > 5){
        return res.status(400).send("Invalid privl")
    }

    
    try{
        fileOwnerResult = await getFileOwner(target_file_id);
        if(fileOwnerResult.rowCount === 0){
            res.status(404).send("No such file");
        }

        if(fileOwnerResult.rows[0].user_id !== token_id){
            return res.status(401).send("You are not the owner of this file");
        }

        const privlCheckResult = await privlCheck(target_file_id,privl); //CHECK PRIVL
        if(privlCheckResult.rowCount > 0){
            return res.status(400).send("Parent privl higher than child privl");
        }
        await setPrivl(target_file_id, privl);
        return res.sendStatus(200);
        
    }catch (e){
        console.log(e);
        return res.sendStatus(500);
    }
    

})

//DELETE file_id
router.delete("/:file_id", determineLogInJWT, logInRequire, async (req,res) =>{
    token_id = req.user;
    const target_file_id = parseInt(req.params.file_id);

   
    try{
        fileOwnerResult = await getFileOwner(target_file_id);
        if(fileOwnerResult.rowCount === 0){
            res.status(404).send("No such file");
        }

        if(fileOwnerResult.rows[0].user_id !== token_id){
            return res.status(403).send("You are not the owner of this file");
        }else{
            await removeFile(target_file_id);
            return res.sendStatus(200);
        }
    }catch (e){
        console.log(e);
        return res.sendStatus(500);
    }
})


module.exports = router;