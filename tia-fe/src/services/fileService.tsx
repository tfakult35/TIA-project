import FileNoteHeaderType from "../classtypes/FileNoteHeaderType";
import FileNoteTree from "../classtypes/FileNoteTree";


// null - own user files,
// TODO: for the services I should just throw errors and catch them wherever I call them for consistency
async function buildFileNoteTree(id:(number|null), from:string): Promise<FileNoteTree>{ //either from group or from user, then take the list of fileheaders, apply them
    
    try{
        var response;
        if(id === null){
            response = await fetch('/api/files/user/own', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") || ""
                }
            })
        }else{
            if(from === "user"){
                response = await fetch(`/api/files/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token") || ""
                    }
                })
            }else{ // if group
                response = await fetch(`/api/files/group/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token") || ""
                    }
                    
                })
            }
        }
        if(!response.ok){
            throw new Error("Failed to fetch");
        }

        const data = await response.json();

        const fileHeaders: FileNoteHeaderType[] = data;

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
            throw new Error("You are not logged in");
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
            throw new Error("ERROR createFIleNote");
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
            throw new Error("ERROR createFIleNote");
        }
    }

    return response;
    
}
export{buildFileNoteTree, getFileContent, createFileNote,setContent};
