import { ReactNode, useState } from "react"
import {Link} from 'react-router-dom'



const LogIn: React.FC = () => {

    return(

        <div>
            <h1>LOG IN</h1>
            Username:
            <input></input>
            Password:
            <input></input>
            <button>SUBMIT</button>

            <Link to ="/register">Don't have an account? Register. </Link>

        </div>

    )



}



export default LogIn


