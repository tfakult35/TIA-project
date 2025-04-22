import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';


import Home from './pages/Home'
import LogInPage from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import FilesPage from './pages/FilesPage'



function App() {
  console.log("starting");

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  /* useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("token:", token);
    if (token) {
        setIsLoggedIn(true);  //need to verify the token in backend heree
    }
    else{
      setIsLoggedIn(false);
    }
  }, []);
*/
 
  return (
    <>
    <BrowserRouter>
      <Header isLoggedIn = {isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <div className="app-fe">
      <Routes>
        <Route path="/"         element={<Home isLoggedIn = {isLoggedIn}/>}></Route>
        <Route path="/login"    element={<LogInPage isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />}> </Route>
        <Route path="/register" element={<RegisterPage/>}></Route> 
        <Route path="/account/:username"  element ={<AccountPage isLoggedIn = {isLoggedIn} />}></Route>
        <Route path="/account"  element={<AccountPage isLoggedIn = {isLoggedIn} />}></Route>
        <Route path="/files/:username" element={<FilesPage/>}></Route>

      </Routes>
      </div>

    </BrowserRouter>
    <Toaster position = "bottom-center"/>
    </>
  )
}

export default App

//npm run dev