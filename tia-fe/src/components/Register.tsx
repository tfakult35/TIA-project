import { ReactNode, useState } from "react"
import {Link} from 'react-router-dom'





const Register: React.FC = () => {

    return(

        <div>
            <h1>Register</h1>
            Username:
            <input></input>
            Password:
            <input></input>
            <button>SUBMIT</button>

            <Link to="/login"> Already have an account? Log in. </Link>

        </div>

    )



}

export default Register


