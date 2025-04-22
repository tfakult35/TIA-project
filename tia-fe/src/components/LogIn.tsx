import { useState } from "react"
import {Link} from 'react-router-dom'
import { login } from "../services/authService"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

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
                toast.error(error.message); //add error message ui
            });
        
    }

    // controlled/uncontrolled input
    return(

        <div className="login-window">
            <h1>LOG IN</h1>
            Username: <br/>
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>  <br/>            
            Password:<br/>
            <input value={password} onChange={(e) => setPassword(e.target.value)}></input><br/>
            <button onClick={handleSubmit}>SUBMIT</button><br/>

            <Link to ="/register">Don't have an account? Register. </Link><br/>

        </div>

    )



}



export default LogIn


