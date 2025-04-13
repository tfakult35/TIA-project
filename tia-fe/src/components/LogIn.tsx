import { ReactNode, useState } from "react"
import {Link} from 'react-router-dom'
import { login, logout } from "../services/authService"


const LogIn: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        login(username,password)
            .catch((error) => {
                console.log(error.message);
            });
        console.log(localStorage.token);
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


