import { ReactNode, useState } from "react"
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {register} from '../services/authService';





const Register: React.FC = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        register(username,password)
            .then(()=>{
                navigate("/login");
            })
            .catch((error) => {
                console.log(error.message); //add error message ui
            });
        
    }

    return(

        <div>
            <h1>Register</h1>
            Username:
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>              
            Password:
            <input value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={handleSubmit}>SUBMIT</button>


            <Link to="/login"> Already have an account? Log in. </Link>

        </div>

    )



}

export default Register


