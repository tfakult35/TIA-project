function login(username:string, password: string, setIsLoggedIn:Function){

    return fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",  
        },
        body: JSON.stringify({username, password}) //json stringify
    })
        .then((response) =>{ 
            if(!response.ok) {
                if (response.status >= 500){
                    throw Error("Error logging in.");
                } else if( response.status === 401)
                {
                    throw Error("Incorrect password.")                    
                }else{
                    throw Error("User does not exist.")
                }
            }else{
                response.json()                 //json from body stream
                    .then(data => {
                        setIsLoggedIn(true);
                        localStorage.setItem("token",data.token);
                    }); 
            }
        }
        )

}

function logout(setIsLoggedIn:Function){
    setIsLoggedIn(false);
    localStorage.removeItem('token');
}

export {login, logout};