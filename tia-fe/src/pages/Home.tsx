import FileStore from '../components/FileStore'
import TEST_TREE from '../dummy_data/dummy_data'
import TextEditor from '../components/TextEditor'
import { useState } from 'react';

interface HomeProps{
  isLoggedIn:Boolean;
}


const Home: React.FC<HomeProps> = ({isLoggedIn}) => { 

    const fileNoteTree = TEST_TREE;
    const [currentFile, setCurrentFile] = useState<number>(-1);

    //need to rerender this:
    return(


    <>
    {isLoggedIn && (<div className='container'>
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
    
    </div>)}

    {!isLoggedIn && (<> LOG IN to see your files</>)}
    </>
  )
  
}



export default Home