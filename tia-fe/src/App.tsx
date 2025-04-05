import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import FileStore from './components/FileStore'
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {


  return (
    <>
    <Header/>
    <div className='container'>
      <FileStore>

        

      </FileStore>


      
    </div>
    </>
  )
}

export default App

//npm run dev