function login(username:string, password: string){

    return fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",  // Add this line
        },
        body: JSON.stringify({username, password}) //json stringify
    })
        .then((response) =>{ 
            if(!response.ok) {
                if (response.status >= 500){
                    throw Error("500 error login");
                } else{
                    throw Error("400 error login");
                }
            }else{
                response.json()                 //json from body stream
                    .then(data => {
                        localStorage.setItem("token",data.token);
                    }); 
            }
        }
        )

}

function logout(){
    return("ok")
}

export {login, logout};