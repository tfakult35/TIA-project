import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import FileStore from './components/FileStore'
import 'bootstrap/dist/css/bootstrap.min.css'
import TEST_TREE from './dummy_data/dummy_data'
import FileNoteType from './classtypes/FileNoteType'
import FileNote from './components/FileNote'




function App() {

  const fileNoteTree = TEST_TREE;

  return (
    <>
    <Header/>
    
    
    <div className='container'>
      <FileStore fileNoteTree={fileNoteTree}>

      </FileStore>
    
    </div>
    </>
  )
}

export default App

//npm run dev