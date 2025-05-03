async function getUserDesc(username:string|undefined){
    var response;
    if(username !== undefined){
        response = await fetch(`/api/accounts/desc/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  
        } 
    })}
    else{
        response = await fetch("/api/accounts/desc", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") || ""
      
            },
        })
    }
    
    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            throw new Error("No such user!");
        }
    }

    const result = await response.json();
    return result;
}


async function getFriends(){
    
    const response = await fetch("/api/accounts/friends", {
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
            throw new Error("You are not logged in");
        }
    }

    const result = await response.json();
    return result;

}

async function getFriendReqs(){
    const response = await fetch("/api/accounts/friends_requests", {
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
            throw new Error("You are not logged in");
        }
    }

    const result = await response.json();
    return result;
}

async function checkFriendship(username:string){
    const response = await fetch(`/api/accounts/friends/${username}`, {
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
            throw new Error("You are not logged in");
        }
    }

    const result = await response.json();
    return result["isFriend"];
}

export {getUserDesc, getFriends, getFriendReqs,checkFriendship}