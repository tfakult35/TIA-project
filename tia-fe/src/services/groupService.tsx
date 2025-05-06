

async function createNewGroup(group_name:string){

    const response = await fetch(`/api/groups/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({ "group_name": group_name  })
    });


    if(!response.ok){
        const errorm = await response.text();
        throw new Error(errorm);
    }

    return;
}


async function leaveGroup(group_name:string){

    const response = await fetch(`/api/groups/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({ "group_name": group_name  })
    });


    if(!response.ok){
        const errorm = await response.text();
        throw new Error(errorm);
    }

    return;
}

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



async function getGroupMembers(group_name:string){
    const response = await fetch(`/api/groups/members/${group_name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
    })

    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else if (response.status === 401){
            throw new Error("Permission");  /// if he has no permission to check we catch the error
        } else {
            throw new Error("Error!")
        }
    }

    const result = await response.json();
    return result;
}

async function inviteToGroup(group_name:string, username:string){
    const response = await fetch(`/api/accounts/groups_reqs/${group_name}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ "username": username  })
    })


    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("Error!");
        }
    }
}

async function groupReply(group_name:string,accept:boolean){
    const response = await fetch(`/api/accounts/groups_reqs/${group_name}/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({ "accept": accept  })
    });


    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("Error!");
        }
    }
}



export {searchGroups, getGroups,getGroupsReqs, getGroupMembers, createNewGroup, leaveGroup,inviteToGroup,groupReply}