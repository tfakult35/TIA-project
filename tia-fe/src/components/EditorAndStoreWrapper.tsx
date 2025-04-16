import FileStore from '../components/FileStore'
import TextEditor from '../components/TextEditor'
import { useEffect, useState } from 'react';
import FileNoteTree from '../classtypes/FileNoteTree';

interface EditorAndStoreWrapperProps{
  isLoggedIn:Boolean;
  fileNoteTree:FileNoteTree
}


const EditorAndStoreWrapper: React.FC<EditorAndStoreWrapperProps> = ({isLoggedIn,fileNoteTree}) => { 
    

    const [currentFile,setCurrentFile] = useState<number|null>(null);
    const [triggerRender, setTrigerRender] = useState<boolean>(false);

    return(

    <>
    <div className='container'>
      <div className='row'>
        <div className='col-3'>  
          <FileStore fileNoteTree={fileNoteTree} setCurrentFile={setCurrentFile} triggerRender={triggerRender}
          setTriggerRender={setTrigerRender}>

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



export default EditorAndStoreWrapper