import { logout } from "../services/authService"
import { Link } from "react-router-dom"

interface HeaderProps{
    isLoggedIn: Boolean,
    setIsLoggedIn:Function
}


//WHY doesnt home rerender when I change isLoggedIn

const Header:React.FC<HeaderProps> = ({isLoggedIn,setIsLoggedIn}) => {
    return (
        <>
        <nav className="navbar navbar-expand-lg">


            <Link className="navbar-brand" to="/">NotesHare</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                   <span className="navbar-toggler-icon"></span>
               </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
               <ul className="navbar-nav mr-auto">
                   <li className="nav-item"><Link className="nav-link" to="/">Notes</Link></li>
                   <li className="nav-item"><Link className="nav-link" to="/">Groups</Link></li>                       
                   <li className="nav-item"><Link className="nav-link" to="/">Account</Link></li>
                   {!isLoggedIn && (<li className="nav-item"><Link className="nav-link" to="/login">Log in</Link></li>)}
                </ul>


            </div>




        </nav>

        {isLoggedIn && (<button onClick= {() =>logout(setIsLoggedIn)}>Log out</button>)}
        </>


    )


}

export default Header