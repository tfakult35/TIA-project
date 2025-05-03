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

async function checkFriendship(username:string){ //1 friends, 0 not friends, 2 req pending
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


async function addFriend(username:string) {
    const response = await fetch(`/api/accounts/friends/${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
    })

    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            const message = await response.text();
            throw new Error(message);
        }
    }

    const result = await response.json();
    return result["Added"]; //added true/false, true if a request was already pending, false if a request was only sent requester = user, reciever = target user


}

async function deleteFriend(username:string){
    const response = await fetch(`/api/accounts/friends/${username}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",  
            "Authorization": localStorage.getItem("token") || "",
        },
    })

    if(!response.ok){
        if (response.status >= 500) {
            throw new Error("API error");
        } else {
            const message = await response.text();
            throw new Error(message);
        }
    }
}


export {getUserDesc, getFriends, getFriendReqs,checkFriendship, addFriend, deleteFriend}