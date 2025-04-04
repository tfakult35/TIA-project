

function Header(){

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">


            <a className="navbar-brand" href="#">NotesHare</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                   <span className="navbar-toggler-icon"></span>
               </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
               <ul className="navbar-nav mr-auto">
                   <li className="nav-item"><a className="nav-link" href="#home">Notes</a></li>
                   <li className="nav-item"><a className="nav-link" href="#about">Groups</a></li>                       
                   <li className="nav-item"><a className="nav-link" href="#contact">Account</a></li>
                   <li className="nav-item"><a className="nav-link" href="#ok">Log out</a></li>
                </ul>
            </div>




        </nav>


    )


}

export default Header