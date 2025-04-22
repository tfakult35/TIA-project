import { ReactNode, useState } from "react"
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {register} from '../services/authService';
import toast from "react-hot-toast";





const Register: React.FC = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        const cleanedName = username.replace(/[^a-zA-Z0-9]/g, '');
        if(username !== cleanedName){
            toast.error("Invalid characters in username.")
            return;
        }
        register(username,password)
            .then(()=>{
                navigate("/login");
            })
            .catch((error) => {
                toast.error(error.message); //add error message ui
            });
        
    }

    return(

        <div className = 'login-window'>
            <h1>REGISTER</h1> 
            Username: <br/>
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>   <br/>           
            Password: <br/>
            <input value={password} onChange={(e) => setPassword(e.target.value)}></input> <br/>
            <button onClick={handleSubmit}>SUBMIT</button> <br/>


            <Link to="/login"> Already have an account? Log in. </Link> <br/>

        </div>

    )



}

export default Register


