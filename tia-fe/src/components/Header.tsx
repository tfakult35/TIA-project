import { logout } from "../services/authService"
import { Link } from "react-router-dom"

interface HeaderProps{
    isLoggedIn: Boolean,
    setIsLoggedIn:Function
}


const Header:React.FC<HeaderProps> = ({isLoggedIn,setIsLoggedIn}) => {
    return (
        <div className='header'>
        <nav className="navbar navbar-expand-lg">


            <Link className="navbar-brand" to="/">NotesHare</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                   <span className="navbar-toggler-icon"></span>
               </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
               <ul className="navbar-nav mr-auto">
                   <li className="nav-item"><Link className="nav-link" to="/">Notes</Link></li>
                   <li className="nav-item"><Link className="nav-link" to="/">Groups</Link></li>                       
                   <li className="nav-item"><Link className="nav-link" to="/account">Account</Link></li>
                   <li className="nav-item"><Link className="nav-link" to="/search">Search</Link></li>
                   {!isLoggedIn && (<li className="nav-item"><Link className="nav-link" to="/login">Log in</Link></li>)}
                   {isLoggedIn && ( <li className="nav-item"><button className="nav-link btn btn-link" onClick= {() =>logout(setIsLoggedIn)}>Log out</button></li>)}

                </ul>


            </div>




        </nav>

        </div>


    )


}

export default Header