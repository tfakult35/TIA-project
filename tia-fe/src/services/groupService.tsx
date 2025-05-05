



async function searchGroups(prefix:string){
    const response = await fetch(`/api/groups/search/${prefix}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  
        },
    })

    if(!response.ok){
        const errorm = await response.text();
        throw new Error(errorm);
    }

    const result = await response.json();
    return result;
}


/*-----GROUPS------- */


async function getGroups(){
    
    const response = await fetch("/api/accounts/groups", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
    })
    
    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("Invalid credentials");
        }
    }

    const result = await response.json();
    return result;

}



async function getGroupsReqs(){
    
    const response = await fetch("/api/accounts/groups_reqs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
    })
    
    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("Invalid credentials");
        }
    }

    const result = await response.json();
    return result;

}

async function getGroupDesc(group_name:string){
    const response = await fetch(`/api/groups/desc/${group_name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
    })

    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("Error!");
        }
    }
}


export {searchGroups, getGroups,getGroupsReqs}