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



function App() {

  const fileNoteTree = TEST_TREE;
  const [currentFile, setCurrentFile] = useState<number>(-1);
  

  return (
    <BrowserRouter>
      
      <Header/>
      <div className="app-fe">
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<LogInPage/>}> </Route>

      </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App

//npm run dev