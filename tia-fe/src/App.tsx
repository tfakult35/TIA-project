import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import FileStore from './components/FileStore'
import 'bootstrap/dist/css/bootstrap.min.css'
import TEST_TREE from './dummy_data/dummy_data'
import FileNoteType from './classtypes/FileNoteType'
import FileNote from './components/FileNote'
import TextEditor from './components/TextEditor'


function App() {

  const fileNoteTree = TEST_TREE;
  

  //header then split container 1/4 FileStore, 3/4 text editor (adjustable?)
  return (
    <>
    <Header/>
    
    
    <div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTree={fileNoteTree}>

          </FileStore>
        </div>
        <div className='col-9'>
          <TextEditor>

          </TextEditor>
        </div>

      </div>
    
    </div>
    </>
  )
}

export default App

//npm run dev