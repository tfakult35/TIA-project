import FileNoteHeaderType from "../classtypes/FileNoteHeaderType";
import FileNoteTree from "../classtypes/FileNoteTree";


// null - own user files,
// TODO: for the services I should just throw errors and catch them wherever I call them for consistency
async function buildFileNoteTree(name:string|null, from:string): Promise<FileNoteTree>{ //either from group or from user, then take the list of fileheaders, apply them
    
    try{
        var response;
        if(name === null){
            response = await fetch('/api/files/user/', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || ""
                }
            })
        }else{
            if(from === "user"){
                response = await fetch(`/api/files/user/${name}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token") || ""
                    }
                })
            }else if (from === "group"){ // if group
                response = await fetch(`/api/files/groups/${name}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token") || ""
                    }
                    
                })
            }else{
                throw new Error("Error calling build file note tree");
            }
        }
        if(!response.ok){
            throw new Error("Failed to fetch");
        }

        const data = await response.json();

        const fileHeaders: FileNoteHeaderType[] = data;

        //so group view doesnt screw up
        const existingIds = new Set(fileHeaders.map(fh => fh.file_id));
        for (const fileHeader of fileHeaders) {
        if (fileHeader.parent_id !== null && !existingIds.has(fileHeader.parent_id)) {
            fileHeader.parent_id = null;
        }
        }

        const hierarchyMap = new Map<Number,Number[]>();
        const idMap = new Map<Number,FileNoteHeaderType>();
        for(const fileHeader of fileHeaders){
            idMap.set(fileHeader.file_id, fileHeader);
            
            if(!hierarchyMap.get(fileHeader.file_id)) hierarchyMap.set(fileHeader.file_id,[]);

            if(fileHeader.parent_id !== null){
                if(!hierarchyMap.get(fileHeader.parent_id)){
                    hierarchyMap.set(fileHeader.parent_id,[]);
                }
                hierarchyMap.get(fileHeader.parent_id)!.push(fileHeader.file_id);
            }   
        }

        return new FileNoteTree(hierarchyMap,idMap);


    }
    catch (e){
        console.log(e);
        return new FileNoteTree(new Map(),new Map());
    }
}


async function getFileContent(file_id: number): Promise<string> {
    const response = await fetch(`/api/files/${file_id}/content`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        }
    });

    if (!response.ok) {
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("Error getting file content");
        }
    }

    const content = await response.json();
    return content;
}

async function createFileNote(file_name:string, parent_file_id:number|null){
    const response = await fetch(`/api/files/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({file_name,parent_file_id})
    });

    if(!response.ok){ //FINISH THIS
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("ERROR creating file note");
        }
    }
    
    const result = await response.json();
    return result;
}

async function setContent(file_id:number,content:string){
    const response = await fetch(`/api/files/${file_id}/content`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({ "content": content })
    });

    if(!response.ok){ //FINISH THIS
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("ERROR setting file content");
        }
    }

    return response;
    
}


async function deleteFileNote(file_id:Number){
    const response = await fetch(`/api/files/${file_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        }
    });

    if (!response.ok) {
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("ERROR deleting file");
        }
    }
}

async function rename(file_id:Number, file_name:string){
    const response = await fetch(`/api/files/${file_id}/name`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({ "file_name": file_name })
    });

    if(!response.ok){ //FINISH THIS
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("ERROR renaming file");
        }
    }

    return response;
}


async function changeAccessControl(file_id:Number,privl:number){
    const response = await fetch(`/api/files/${file_id}/access`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || "", 
        },
        body: JSON.stringify({ "privl": privl })
    });

    if(!response.ok){ //FINISH THIS
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("ERROR changing access control");
        }
    }

    return response;

}

async function changeGroupMembership(file_id:Number, group_name:string |null){
    const response = await fetch(`/api/files/${file_id}/group`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || "", 
        },
        body: JSON.stringify({ "group_name": group_name })
    });

    if(!response.ok){ //FINISH THIS
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("ERROR changing group membership");
        }
    }

    return response;
}
export{buildFileNoteTree, getFileContent, createFileNote,
    setContent,deleteFileNote,rename,changeAccessControl, changeGroupMembership};
