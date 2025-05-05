import { useState } from 'react'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';


import Home from './pages/Home'
import LogInPage from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import FilesPage from './pages/FilesPage'
import MyAccountPage from './pages/MyAccountPage'
import SearchPage from './pages/SearchPage'
import MyGroupPage from './pages/MyGroupPage'
import GroupPage from './pages/GroupPage'



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
        <Route path="/search" element={<SearchPage/>}></Route>
        <Route path="/account/:username"  element ={<AccountPage isLoggedIn = {isLoggedIn} />}></Route>
        <Route path="/account"  element={<MyAccountPage isLoggedIn = {isLoggedIn} />}></Route>
        <Route path="/files/:username" element={<FilesPage/>}></Route>
        <Route path="/groups/:group_name" element={<GroupPage isLoggedIn ={isLoggedIn}></GroupPage>} ></Route>
        <Route path="/groups" element={<MyGroupPage isLoggedIn ={isLoggedIn}></MyGroupPage>} ></Route>


      </Routes>
      </div>

    </BrowserRouter>
    <Toaster position = "bottom-center"/>
    </>
  )
}

export default App

//npm run dev