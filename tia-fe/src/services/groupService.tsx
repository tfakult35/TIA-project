



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


export {searchGroups}