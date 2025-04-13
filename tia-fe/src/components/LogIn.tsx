import { useState } from "react"
import {Link} from 'react-router-dom'
import { login } from "../services/authService"
import { useNavigate } from "react-router-dom"

interface LogInProps{
    isLoggedIn:Boolean,
    setIsLoggedIn:Function
}

const LogIn: React.FC<LogInProps> = ({isLoggedIn,setIsLoggedIn}) => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        login(username,password,setIsLoggedIn)
            .then(()=>{
                setIsLoggedIn(true);
                navigate("/");
            })
            .catch((error) => {
                console.log(error.message); //add error message ui
            });
        
    }

    // controlled/uncontrolled input
    return(

        <div>
            <h1>LOG IN</h1>
            Username:
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>              
            Password:
            <input value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={handleSubmit}>SUBMIT</button>

            <Link to ="/register">Don't have an account? Register. </Link>

        </div>

    )



}



export default LogIn


