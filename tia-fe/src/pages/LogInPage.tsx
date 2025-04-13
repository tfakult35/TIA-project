import LogIn from "../components/LogIn"


interface LogInPageProps{
    isLoggedIn:Boolean,
    setIsLoggedIn:Function
}

const LogInPage: React.FC<LogInPageProps> = ({isLoggedIn,setIsLoggedIn}) => { 
    return(

        <div>

            <LogIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            

        </div>

    )
}

export default LogInPage