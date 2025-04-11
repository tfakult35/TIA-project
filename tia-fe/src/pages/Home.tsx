import FileStore from '../components/FileStore'
import TEST_TREE from '../dummy_data/dummy_data'
import TextEditor from '../components/TextEditor'
import { useState } from 'react';

function Home(){


    const fileNoteTree = TEST_TREE;
    const [currentFile, setCurrentFile] = useState<number>(-1);


    return(


    <>
    
    
    <div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTree={fileNoteTree} setCurrentFile={setCurrentFile}>

          </FileStore>
        </div>
        <div className='col-9'>
          <TextEditor currentFile={currentFile} setCurrentFile={setCurrentFile} fileNoteTree={fileNoteTree}>

          </TextEditor>
        </div>

      </div>
    
    </div>
    </>
    )
}


export default Home