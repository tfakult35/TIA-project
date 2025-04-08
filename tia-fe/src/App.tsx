import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import FileStore from './components/FileStore'
import 'bootstrap/dist/css/bootstrap.min.css'
import TEST_TREE from './dummy_data/dummy_data'
import TextEditor from './components/TextEditor'


function App() {

  const fileNoteTree = TEST_TREE;
  const [currentFile, setCurrentFile] = useState<number>(-1);

  //header then split container 1/4 FileStore, 3/4 text editor (adjustable?)
  return (
    <div className="app-fe">
    <Header/>
    
    
    <div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTree={fileNoteTree} setCurrentFile={setCurrentFile}>

          </FileStore>
        </div>
        <div className='col-9'>
          <TextEditor currentFile={currentFile} fileNoteTree={fileNoteTree}>

          </TextEditor>
        </div>

      </div>
    
    </div>
    </div>
  )
}

export default App

//npm run dev