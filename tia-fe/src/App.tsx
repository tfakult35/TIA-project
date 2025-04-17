import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'

import Home from './pages/Home'
import LogInPage from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'



function App() {
  console.log("starting");

  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);  //need to verify the token in backend heree
    }
    else{
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Header isLoggedIn = {isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <div className="app-fe">
      <Routes>
        <Route path="/" element={<Home isLoggedIn = {isLoggedIn}/>}></Route>
        <Route path="/login" element={<LogInPage isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />}> </Route>
        <Route path="/register" element={<RegisterPage/>}></Route> 
      </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App

//npm run dev