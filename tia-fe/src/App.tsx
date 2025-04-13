import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import FileStore from './components/FileStore'
import 'bootstrap/dist/css/bootstrap.min.css'
import TEST_TREE from './dummy_data/dummy_data'
import TextEditor from './components/TextEditor'
import { BrowserRouter, Route, Routes} from 'react-router-dom'

import Home from './pages/Home'
import LogInPage from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'



function App() {
  console.log("starting");
  return (
    <BrowserRouter>
      <Header/>
      <div className="app-fe">
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<LogInPage/>}> </Route>
        <Route path="/register" element={<RegisterPage/>}></Route> 
      </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App

//npm run dev